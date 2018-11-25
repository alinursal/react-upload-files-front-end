'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//@prepros-prepend main.js

//only front-end part

var apiUrl = 'http://localhost';

var upload = function upload(form) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};


    var url = apiUrl + '/upload';

    var files = _.get(form, 'files', []);

    var data = new FormData();

    _.each(files, function (file) {
        data.append('files', file);
    });

    data.append('to', _.get(form, 'to'));
    data.append('from', _.get(form, 'from'));
    data.append('message', _.get(form, 'message'));

    var config = {

        onUploadProgress: function onUploadProgress(event) {

            console.log("Upload event", event);

            return callback({
                type: 'onUploadProgress',
                payload: event
            });
        }
    };

    axios.post(url, data, config).then(function (response) {

        // upload successful.

        return callback({

            type: 'success',
            payload: response.data
        });
    }).catch(function (error) {

        return callback({
            type: 'success',
            payload: data
        });
    });
};

var KB = 1024;
var MB = KB * KB;
var TB = KB * KB * KB;

var betterNumber = function betterNumber(input) {
    var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;


    if (input > MB) {
        return round ? _.round(input / MB) + ' M' : input / MB + ' M';
    }

    if (input > KB) {

        return round ? _.round(input / KB) + ' Kb' : input / KB + ' Kb';
    }
};

var HomeForm = function (_React$Component) {
    _inherits(HomeForm, _React$Component);

    function HomeForm(props) {
        _classCallCheck(this, HomeForm);

        var _this = _possibleConstructorReturn(this, (HomeForm.__proto__ || Object.getPrototypeOf(HomeForm)).call(this, props));

        _this.state = {

            form: {
                files: [],
                to: 'friend@gmail.com',
                from: 'me@gmail.com',
                message: 'Hey there!'
            },

            errors: {
                to: null,
                from: null,
                message: null,
                files: null
            }
        };

        _this._onTextChange = _this._onTextChange.bind(_this);
        _this._onSubmit = _this._onSubmit.bind(_this);
        _this._formValidation = _this._formValidation.bind(_this);
        _this._onFileAdded = _this._onFileAdded.bind(_this);
        _this._onFileRemove = _this._onFileRemove.bind(_this);

        return _this;
    }

    _createClass(HomeForm, [{
        key: '_onFileRemove',
        value: function _onFileRemove(key) {
            var files = this.state.form.files;


            files.splice(key, 1);

            this.setState({
                form: _extends({}, this.state.form, {
                    files: files
                })
            });
        }
    }, {
        key: '_onFileAdded',
        value: function _onFileAdded(event) {
            var _this2 = this;

            var files = _.get(this.state, 'form.files', []);

            _.each(_.get(event, 'target.files', []), function (file) {

                files.push(file);
            });

            this.setState({

                form: _extends({}, this.state.form, {
                    files: files
                })
            }, function () {

                _this2._formValidation(['files'], function (isValid) {});
            });
        }
    }, {
        key: '_isEmail',
        value: function _isEmail(emailAddress) {

            var emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

            return emailRegex.test(emailAddress);
        }
    }, {
        key: '_formValidation',
        value: function _formValidation() {
            var _this3 = this;

            var fields = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
            var _state = this.state,
                form = _state.form,
                errors = _state.errors;


            var validations = {

                from: [{
                    errorMessage: 'From is required.',
                    isValid: function isValid() {
                        return form.from.length;
                    }
                }, {
                    errorMessage: 'Email is not valid.',
                    isValid: function isValid() {
                        return _this3._isEmail(form.from);
                    }
                }],

                to: [{
                    errorMessage: 'To is required.',
                    isValid: function isValid() {
                        return form.to.length;
                    }
                }, {
                    errorMessage: 'Email is not valid.',
                    isValid: function isValid() {
                        return _this3._isEmail(form.to);
                    }
                }],
                files: [{
                    errorMessage: 'File is required.',
                    isValid: function isValid() {
                        return form.files.length;
                    }
                }]

            };

            _.each(fields, function (field) {

                var fieldValidations = _.get(validations, field, []); // validations[field];


                errors[field] = null;

                _.each(fieldValidations, function (fieldValidation) {

                    var isValid = fieldValidation.isValid();

                    if (!isValid) {
                        errors[field] = fieldValidation.errorMessage;
                    }
                });
            });

            this.setState({
                errors: errors
            }, function () {

                var isValid = true;

                _.each(errors, function (err) {

                    if (err !== null) {
                        isValid = false;
                    }
                });
                return callback(isValid);
            });
        }
    }, {
        key: '_onSubmit',
        value: function _onSubmit(event) {
            var _this4 = this;

            event.preventDefault();

            this._formValidation(['from', 'to', 'files'], function (isValid) {

                if (isValid) {
                    // the form is valid and ready to submit.

                    var data = _this4.state.form;

                    if (_this4.props.onUploadBegin) {

                        _this4.props.onUploadBegin(data);
                    }

                    upload(data, function (event) {

                        if (_this4.props.onUploadEvent) {

                            _this4.props.onUploadEvent(event);
                        }
                    });
                }
            });
        }
    }, {
        key: '_onTextChange',
        value: function _onTextChange(event) {
            var form = this.state.form;


            var fieldName = event.target.name;
            var fieldValue = event.target.value;

            form[fieldName] = fieldValue;
            this.setState({ form: form });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var _state2 = this.state,
                form = _state2.form,
                errors = _state2.errors;
            var files = form.files;


            return React.createElement(
                'div',
                { className: 'app-card' },
                React.createElement(
                    'form',
                    { onSubmit: this._onSubmit },
                    React.createElement(
                        'div',
                        { className: 'app-card-header' },
                        React.createElement(
                            'div',
                            { className: 'app-card-header-inner' },
                            files.length ? React.createElement(
                                'div',
                                { className: 'app-files-selected' },
                                files.map(function (file, index) {

                                    return React.createElement(
                                        'div',
                                        { key: index, className: 'app-files-selected-item' },
                                        React.createElement(
                                            'div',
                                            { className: 'filename' },
                                            file.name
                                        ),
                                        React.createElement(
                                            'div',
                                            { className: 'file-action' },
                                            React.createElement(
                                                'button',
                                                { onClick: function onClick() {
                                                        return _this5._onFileRemove(index);
                                                    },
                                                    type: 'button', className: 'app-file-remove' },
                                                'X'
                                            )
                                        )
                                    );
                                })
                            ) : null,
                            React.createElement(
                                'div',
                                { className: classNames('app-file-select-zone', { 'error': _.get(errors, 'files') }) },
                                React.createElement(
                                    'label',
                                    { htmlFor: 'input-file' },
                                    React.createElement('input', { onChange: this._onFileAdded, id: 'input-file', type: 'file', multiple: true }),
                                    files.length ? React.createElement(
                                        'span',
                                        { className: 'app-upload-description text-uppercase' },
                                        'Add more files'
                                    ) : React.createElement(
                                        'span',
                                        null,
                                        React.createElement(
                                            'span',
                                            { className: 'app-upload-icon' },
                                            React.createElement('i', { className: 'icon-picture-streamline' }),
                                            ' '
                                        ),
                                        React.createElement(
                                            'span',
                                            { className: 'app-upload-description' },
                                            'Drag and drop your files here.'
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'app-card-content' },
                        React.createElement(
                            'div',
                            { className: 'app-card-content-inner' },
                            React.createElement(
                                'div',
                                { className: classNames('app-form-item', { 'error': _.get(errors, 'to') }) },
                                React.createElement(
                                    'label',
                                    { htmlFor: 'to' },
                                    'Send to'
                                ),
                                React.createElement('input', { onChange: this._onTextChange, value: form.to, name: 'to',
                                    placeholder: _.get(errors, 'to') ? _.get(errors, 'to') : 'Email address', type: 'text', id: 'to' })
                            ),
                            React.createElement(
                                'div',
                                { className: classNames('app-form-item', { 'error': _.get(errors, 'from') }) },
                                React.createElement(
                                    'label',
                                    { htmlFor: 'from' },
                                    'From'
                                ),
                                React.createElement('input', { value: _.get(form, 'from'), onChange: this._onTextChange, name: 'from', placeholder: _.get(errors, 'from') ? _.get(errors, 'from') : 'Your email address',
                                    type: 'text', id: 'from' })
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-form-item' },
                                React.createElement(
                                    'label',
                                    { htmlFor: 'message' },
                                    'Message'
                                ),
                                React.createElement('textarea', { value: _.get(form, 'message', ''), onChange: this._onTextChange, placeholder: 'Add a note (optional)',
                                    id: 'message', name: 'message' })
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-form-actions' },
                                React.createElement(
                                    'button',
                                    { type: 'submit', className: 'app-button primary' },
                                    'Send'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return HomeForm;
}(React.Component);

var HomeUploading = function (_React$Component2) {
    _inherits(HomeUploading, _React$Component2);

    function HomeUploading(props) {
        _classCallCheck(this, HomeUploading);

        var _this6 = _possibleConstructorReturn(this, (HomeUploading.__proto__ || Object.getPrototypeOf(HomeUploading)).call(this, props));

        _this6.state = {
            startTime: new Date(),
            lastLoaded: 0,
            speedUpload: 0,
            data: null,
            loaded: 0,
            total: 0,
            percentage: 10
        };

        return _this6;
    }

    _createClass(HomeUploading, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var data = this.props.data;


            this.setState({
                data: data
            });
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            var event = nextProps.event;


            switch (_.get(event, 'type')) {

                case 'onUploadProgress':

                    var loaded = _.get(event, 'payload.loaded', 0);
                    var total = _.get(event, 'payload.total', 0);
                    var percentage = total !== 0 ? loaded / total * 100 : 0;

                    var currentTime = new Date();
                    var diffTimeBetweenStartAndCurrent = currentTime - this.state.startTime; // this is miliseconds. not Second.


                    if (diffTimeBetweenStartAndCurrent === 0) {
                        diffTimeBetweenStartAndCurrent = 1;
                    }

                    var speedPerOneMilisecond = (loaded - this.state.lastLoaded) / diffTimeBetweenStartAndCurrent;

                    var speedPerSecond = speedPerOneMilisecond * 1000;

                    this.setState({
                        speedUpload: speedPerSecond,
                        startTime: currentTime,
                        lastLoaded: loaded,
                        loaded: loaded,
                        total: total,
                        percentage: percentage
                    });

                    break;

                default:

                    break;
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _this7 = this;

            var _state3 = this.state,
                percentage = _state3.percentage,
                data = _state3.data,
                total = _state3.total,
                loaded = _state3.loaded,
                speedUpload = _state3.speedUpload;


            var totalFiles = _.get(data, 'files', []).length;

            return React.createElement(
                'div',
                { className: 'app-card app-card-uploading' },
                React.createElement(
                    'div',
                    { className: 'app-card-content' },
                    React.createElement(
                        'div',
                        { className: 'app-card-content-inner' },
                        React.createElement(
                            'div',
                            { className: 'app-home-uploading' },
                            React.createElement(
                                'div',
                                { className: 'app-home-uploading-icon' },
                                React.createElement('i', { className: 'icon-upload' }),
                                React.createElement(
                                    'h2',
                                    null,
                                    'Sending...'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-upload-files-total' },
                                'Uploading ',
                                totalFiles,
                                ' files.'
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-progress' },
                                React.createElement('span', { style: { width: percentage + '%' }, className: 'app-progress-bar' })
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-upload-stats' },
                                React.createElement(
                                    'div',
                                    { className: 'app-upload-stats-left' },
                                    betterNumber(loaded),
                                    '/',
                                    betterNumber(total)
                                ),
                                React.createElement(
                                    'div',
                                    { className: 'app-upload-stats-right' },
                                    betterNumber(speedUpload),
                                    '/s'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-form-actions' },
                                React.createElement(
                                    'button',
                                    { onClick: function onClick() {

                                            if (_this7.props.onCancel) {
                                                _this7.props.onCancel(true);
                                            }
                                        }, className: 'app-upload-cancel-button app-button', type: 'button' },
                                    'Cancel'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return HomeUploading;
}(React.Component);

var HomeUploadSent = function (_React$Component3) {
    _inherits(HomeUploadSent, _React$Component3);

    function HomeUploadSent(props) {
        _classCallCheck(this, HomeUploadSent);

        return _possibleConstructorReturn(this, (HomeUploadSent.__proto__ || Object.getPrototypeOf(HomeUploadSent)).call(this, props));
    }

    _createClass(HomeUploadSent, [{
        key: 'render',
        value: function render() {
            var _this9 = this;

            var data = this.props.data;


            console.log("Data", data);

            var to = _.get(data, 'to');
            var postId = _.get(data, '_id');
            return React.createElement(
                'div',
                { className: 'app-card app-card-upload-sent' },
                React.createElement(
                    'div',
                    { className: 'app-card-content' },
                    React.createElement(
                        'div',
                        { className: 'app-card-content-inner' },
                        React.createElement(
                            'div',
                            { className: 'app-home-uploading' },
                            React.createElement(
                                'div',
                                { className: 'app-home-upload-sent-icon' },
                                React.createElement('i', { className: 'icon-paperplane' })
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-upload-sent-message app-text-center' },
                                React.createElement(
                                    'h2',
                                    null,
                                    'Files sent!'
                                ),
                                React.createElement(
                                    'p',
                                    null,
                                    'We\'re sent an email to ',
                                    to,
                                    ' with a download link. The link will expire in 30 days.'
                                )
                            ),
                            React.createElement(
                                'div',
                                { className: 'app-upload-sent-actions app-form-actions' },
                                React.createElement(
                                    'button',
                                    { onClick: function onClick() {
                                            if (_this9.props.onSendAnotherFile) {
                                                _this9.props.onSendAnotherFile(true);
                                            }
                                        }, className: 'app-button', type: 'button' },
                                    'Send another file'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return HomeUploadSent;
}(React.Component);

var Home = function (_React$Component4) {
    _inherits(Home, _React$Component4);

    function Home(props) {
        _classCallCheck(this, Home);

        var _this10 = _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).call(this, props));

        _this10.state = {
            componentName: 'HomeForm',
            data: null,
            uploadEvent: null
        };

        _this10._renderComponent = _this10._renderComponent.bind(_this10);

        return _this10;
    }

    _createClass(Home, [{
        key: '_renderComponent',
        value: function _renderComponent() {
            var _this11 = this;

            var _state4 = this.state,
                componentName = _state4.componentName,
                data = _state4.data,
                uploadEvent = _state4.uploadEvent;


            var delay = function () {
                var timer = 0;
                return function (callback, ms) {
                    clearTimeout(timer);
                    timer = setTimeout(callback, ms);
                };
            }();

            switch (componentName) {

                case 'HomeUploading':

                    return React.createElement(HomeUploading, { event: uploadEvent, data: data });

                case 'HomeUploadSent':

                    return React.createElement(HomeUploadSent, { onSendAnotherFile: function onSendAnotherFile() {

                            _this11.setState({
                                componentName: 'HomeForm'
                            });
                        }, data: data });

                default:
                    return React.createElement(HomeForm, {
                        onUploadEvent: function onUploadEvent(event) {

                            var data = _this11.state.data;

                            if (_.get(event, 'type') === 'success') {

                                data = _.get(event, 'payload');
                            }

                            _this11.setState({
                                data: data,
                                uploadEvent: event,
                                componentName: _.get(event, 'type') === 'success' ? 'HomeUploadSent' : _this11.state.componentName
                            });
                        },

                        onUploadBegin: function onUploadBegin(data) {

                            _this11.setState({
                                data: data,
                                componentName: 'HomeUploading'
                            });
                        } });
                    return;
            }
        }
    }, {
        key: 'render',
        value: function render() {

            return React.createElement(
                'div',
                { className: 'app-container' },
                React.createElement(
                    'div',
                    { className: 'app-content' },
                    this._renderComponent()
                )
            );
        }
    }]);

    return Home;
}(React.Component);

ReactDOM.render(React.createElement(Home, null), document.getElementById('root'));
//# sourceMappingURL=main-dist.js.map