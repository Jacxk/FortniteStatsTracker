let loading = $("#loading_screen");
let login_window = $("#login_window");
let main_window = $("#main_window");
const configBtn = $('#configuration');

let storage = new Configuration();

const presence = undefined;

$("#login_btn").click(async function (e) {
    e.preventDefault();
    await loading.show();

    let username_input = $("#username_input");
    let platform = $("label.platform input:checked");

    if (!username_input.val())
        return M.toast({html: "Username cannot be empty!", displayLength: 5000, classes: "red lighten-1"});
    if (!storage.getApiKey()) {
        configBtn.addClass('pulse');
        return M.toast({html: "You need to enter an api key!", displayLength: 5000, classes: "red lighten-1"});
    }

    login(username_input.val(), platform.val());

    if (!checkIfLogged()) return;

    if (Fortnite.first_time) {
        displayHomePage().then((error) => {
            if (error === false) loadStats();
        });
        return;
    }

    loadStats();

    function loadStats() {
        getStatsFromServer().then(() => {
            time_passed = seconds;
            displayStats().then(async () => {
                toggleWindows(main_window);

                await updateStats();
                await loading.hide();

                ipcRenderer.send('rpc:events', {
                    state: 'news',
                    username: storage.getUsername(),
                    platform: storage.getPlatform()
                })
            }).catch(err => {
                console.log(err);
                loading.hide();
                M.toast({html: err, displayLength: 7000, classes: "red lighten-1"})
            });
        }).catch(err => {
            console.log(err);
            loading.hide();
            M.toast({html: err, displayLength: 7000, classes: "red lighten-1"})
        });
    }

});

$("#logout_btn").click(function (e) {
    e.preventDefault();
    if (!checkIfLogged(true, true)) return;
    Fortnite.first_time = false;

    let instance = M.Modal.getInstance($('#logout_modal'));
    instance.open();
});

$('#nav-mobile li').click(function (e) {
    e.preventDefault();
    let a = $(this);

    if (a.attr('id') === 'logout_btn') return;
    if (a.attr('id') === 'stats_btn') {
        ipcRenderer.send('rpc:events', {
            state: 'stats',
            username: storage.getUsername(),
            platform: storage.getPlatform()
        });
    }
    if (a.attr('id') === 'home_btn') {
        ipcRenderer.send('rpc:events', {
            state: 'news',
            username: storage.getUsername(),
            platform: storage.getPlatform()
        });
    }

    $('#nav-mobile li').removeClass('active');
    $('[homeWindow]').hide();

    a.addClass('active');
    $("#" + a.data('window-id')).show();
});

configBtn.click(function () {
    if (configBtn.hasClass('pulse')) configBtn.removeClass('pulse');
    let instance = M.Modal.getInstance($('#config_modal'));
    instance.open();
});

$(document).ready(function () {
    main_window.hide();
    $('.home-contents').hide();
    $('#news').show();

    $("time.timeago").timeago();
    M.Modal.init($('.modal'), {
        preventScrolling: false,
        dismissible: true
    });
    M.Tooltip.init($('.tooltipped'));
    M.Tooltip.init($('#api_key_info'), {
        enterDelay: 600,
        html: "<span>To get an api key you<br>" +
        "must go to <a>https://fortniteapi.com/</a></span>"
    });
    M.Collapsible.init($('.collapsible'), {});
    modalListeners();
    storage.loadConfig(0);
});


$(document).on('click', 'a[href^="http"]', function (event) {
    event.preventDefault();
    electron.shell.openExternal(this.href);
});

function modalListeners() {
    function apiAndRefreshListener() {
        const $updateTime = $('#updateTime');
        const $apiKey = $('#api_key');

        $updateTime.change(function () {
            if ($updateTime.val() < 5) return $('#settings_error').html('Refresh rate should be 5 or greater!');
            else $('#settings_error').html('');

            storage.setUpdateTime($updateTime.val()).save().setApiKey($apiKey.val());
        });

        $apiKey.change(function () {
            storage.setApiKey($apiKey.val()).save();
        });
    }

    function resetDataListener() {
        $('#reset_data_yes').click(function () {
            storage.getStorage().clear();
            storage.loadConfig(2);
            M.toast({html: "Data cleared!", displayLength: 3000, classes: "red lighten-1"});
        });

        $('#reset_saved_data').click(function () {
            let instance = M.Modal.getInstance($('#reset_data_modal'));
            instance.open();
        })
    }

    function logoutListener() {
        $('#logout_yes').click(function (e) {
            e.preventDefault();
            Fortnite.logged = false;
            toggleWindows(login_window);
            M.toast({html: "Logged out!", displayLength: 3000, classes: "red lighten-1"});
            if (presence) presence.setLoggedOff();
            ipcRenderer.send('rpc:events', {
                state: 'logout',
                username: storage.getUsername(),
                platform: storage.getPlatform()
            });
        });
    }

    apiAndRefreshListener();
    resetDataListener();
    logoutListener();
}

$('.navigator-btn').click(function () {
    const current = $(this);
    const buttons = $('.navigator-btn');

    buttons.removeClass('navigator-btn-selected');
    current.addClass('navigator-btn-selected');

    $('.home-contents').hide();
    const home_contents = $('#' + current.data('home-content'));
    home_contents.show();
    ipcRenderer.send('rpc:events', {
        state: current.data('home-content'),
        username: storage.getUsername(),
        platform: storage.getPlatform()
    })
});

async function displayHomePage() {
    return new Promise(async (resolve) => {

        function sendError() {
            if (errorObject.error === true) {
                ipcRenderer.send('rpc:events', {
                    state: "logout",
                    username: storage.getUsername(),
                    platform: storage.getPlatform()
                });
                configBtn.addClass('pulse');
                M.toast({html: errorObject.message, displayLength: 7000, classes: "red lighten-1"});
                loading.hide();
                return false
            }
            return true;
        }

        await displayNews();
        if (!sendError()) return resolve(true);

        await displayNotes();
        if (!sendError()) return resolve(true);

        await displayChallenges();
        if (!sendError()) return resolve(true);

        await displayItemsComing();
        if (!sendError()) return resolve(true);

        await displayStore();
        if (!sendError()) return resolve(true);

        storage.loadConfig();
        resolve(false);
    });
}

let updateTime = storage.getUpdateTime();
let seconds = (updateTime * 60) * 1000;
let time_passed = seconds;

function updateStats() {
    setInterval(() => {
        if (time_passed <= 0) {
            time_passed = seconds;
            M.toast({html: "Updating player stats!", displayLength: 5000, classes: "green lighten-1"});
            displayStats();
        } else time_passed--;

        let percentage = ((seconds - time_passed) / seconds) * 100;
        $('#stats_update_bar').width(percentage.toFixed(2) + "%");

    }, 0);
}

setTimeout(() => Fortnite.first_time = false, 5 * 60 * 1000);