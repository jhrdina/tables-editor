(function (document) {
    'use strict';
    var app = document.querySelector('#app');
    app.baseUrl = '/';
    if (window.location.port === '') {
        app.baseUrl = '/tables-editor/';
    }
})(document);
