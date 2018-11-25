//@prepros-prepend main.js

//only front-end part

const apiUrl = 'http://localhost';

const upload = (form, callback = () => {}) => {

    const url = `${apiUrl}/upload`;

    let files = _.get(form, 'files', []);

    let data = new FormData();

    _.each(files, (file) => {
        data.append('files', file);
    });

    data.append('to', _.get(form, 'to'));
    data.append('from', _.get(form, 'from'));
    data.append('message', _.get(form, 'message'));

    const config = {

        onUploadProgress: (event) => {

            console.log("Upload event", event);

            return callback({
                type: 'onUploadProgress',
                payload: event,
            })
        }
    }

    axios.post(url, data, config).then((response) => {

        // upload successful.

        return callback({

            type: 'success',
            payload: response.data
        })

    }).catch(function (error) {

        return callback({
            type: 'success',
            payload: data
        })

    });

};

const KB = 1024;
const MB = KB * KB;
const TB =  KB * KB * KB;

const betterNumber = (input, round = true) => {

    if(input > MB){
        return round ? `${_.round(input/MB)} M` : `${(input/MB)} M` ;
    }

    if(input > KB){

        return round ? `${_.round(input/KB)} Kb` : `${(input/KB)} Kb` ;
    }

}

class HomeForm extends React.Component {

    constructor(props) {
        super(props);


        this.state = {

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
                files: null,
            }
        };


        this._onTextChange = this._onTextChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._formValidation = this._formValidation.bind(this);
        this._onFileAdded = this._onFileAdded.bind(this);
        this._onFileRemove = this._onFileRemove.bind(this)


    }


    _onFileRemove(key) {
        let {files} = this.state.form;

        files.splice(key, 1);

        this.setState({
            form: {
                ...this.state.form,
                files: files
            }
        })


    }

    _onFileAdded(event) {

        let files = _.get(this.state, 'form.files', []);


        _.each(_.get(event, 'target.files', []), (file) => {

            files.push(file);

        });



        this.setState({

            form: {
                ...this.state.form,
                files: files,
            }
        }, () => {

            this._formValidation(['files'], (isValid) => {


            });
        });


    }

    _isEmail(emailAddress) {

        const emailRegex = /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

        return emailRegex.test(emailAddress);
    }

    _formValidation(fields = [], callback = () => {}) {

        let {form, errors} = this.state;


        const validations = {

            from: [
                {
                    errorMessage: 'From is required.',
                    isValid: () => {
                        return form.from.length;
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.from);
                    }
                }
            ],

            to: [
                {
                    errorMessage: 'To is required.',
                    isValid: () => {
                        return form.to.length;
                    }
                },
                {
                    errorMessage: 'Email is not valid.',
                    isValid: () => {
                        return this._isEmail(form.to);
                    }
                }
            ],
            files: [
                {
                    errorMessage: 'File is required.',
                    isValid: () => {
                        return form.files.length;
                    }
                }
            ]

        }

        _.each(fields, (field) => {


            let fieldValidations = _.get(validations, field, []); // validations[field];


            errors[field] = null;


            _.each(fieldValidations, (fieldValidation) => {


                const isValid = fieldValidation.isValid();

                if (!isValid) {
                    errors[field] = fieldValidation.errorMessage;
                }

            });


        });


        this.setState({
            errors: errors
        }, () => {

            let isValid = true;

            _.each(errors, (err) => {

                if (err !== null) {
                    isValid = false;
                }
            });
            return callback(isValid);

        });


    }

    _onSubmit(event) {
        event.preventDefault();

        this._formValidation(['from', 'to', 'files'], (isValid) => {


            if(isValid){
                // the form is valid and ready to submit.

                const data = this.state.form;

                if(this.props.onUploadBegin){

                    this.props.onUploadBegin(data);
                }

                upload(data, (event) => {

                    if(this.props.onUploadEvent){

                        this.props.onUploadEvent(event);

                    }
                })



            }
        });
    }

    _onTextChange(event) {

        let {form} = this.state;

        const fieldName = event.target.name;
        const fieldValue = event.target.value;

        form[fieldName] = fieldValue;
        this.setState({form: form});

    }


    render() {

        const {form, errors} = this.state;
        const {files} = form;

        return (
            <div className={'app-card'}>
                <form onSubmit={this._onSubmit}>
                    <div className={'app-card-header'}>
                        <div className={'app-card-header-inner'}>


                            {


                                files.length ? <div className={'app-files-selected'}>

                                    {
                                        files.map((file, index) => {

                                            return (
                                                <div key={index} className={'app-files-selected-item'}>
                                                    <div className={'filename'}>{file.name}</div>
                                                    <div className={'file-action'}>
                                                        <button onClick={() => this._onFileRemove(index)}
                                                                type={'button'} className={'app-file-remove'}>X
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }

                                </div> : null


                            }

                            <div className={classNames('app-file-select-zone', {'error': _.get(errors, 'files')})}>
                                <label htmlFor={'input-file'}>
                                    <input onChange={this._onFileAdded} id={'input-file'} type="file" multiple={true}/>
                                    {
                                        files.length ? <span className={'app-upload-description text-uppercase'}>Add more files</span> :
                                            <span>
                                                <span className={'app-upload-icon'}><i className={'icon-picture-streamline'} /> </span>
                                                <span className={'app-upload-description'}>Drag and drop your files here.</span>
                                            </span>
                                    }
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>
                            <div className={classNames('app-form-item', {'error': _.get(errors, 'to')})}>
                                <label htmlFor={'to'}>Send to</label>
                                <input onChange={this._onTextChange} value={form.to} name={'to'}
                                       placeholder={_.get(errors, 'to') ? _.get(errors, 'to') : 'Email address'} type={'text'} id={'to'}/>
                            </div>

                            <div className={classNames('app-form-item', {'error': _.get(errors, 'from')})}>
                                <label htmlFor={'from'}>From</label>
                                <input value={_.get(form, 'from')} onChange={this._onTextChange} name={'from'} placeholder={_.get(errors, 'from') ? _.get(errors, 'from') : 'Your email address'}
                                       type={'text'} id={'from'}/>
                            </div>


                            <div className={'app-form-item'}>
                                <label htmlFor={'message'}>Message</label>
                                <textarea value={_.get(form, 'message', '')} onChange={this._onTextChange} placeholder={'Add a note (optional)'}
                                          id={'message'} name={'message'}/>
                            </div>


                            <div className={'app-form-actions'}>
                                <button type={'submit'} className={'app-button primary'}>Send</button>
                            </div>


                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

class HomeUploading extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            startTime: new Date(),
            lastLoaded: 0,
            speedUpload: 0,
            data: null,
            loaded: 0,
            total: 0,
            percentage: 10,
        }



    }

    componentDidMount(){
        const {data} = this.props;



        this.setState({
            data: data
        });
    }
    componentWillReceiveProps(nextProps) {
        const {event} = nextProps;



        switch (_.get(event, 'type')){

            case 'onUploadProgress':

                const loaded = _.get(event,'payload.loaded', 0);
                const total = _.get(event, 'payload.total', 0);
                const percentage = total !== 0 ? (loaded/total) * 100 : 0;


                const currentTime = new Date();
                let diffTimeBetweenStartAndCurrent = currentTime - this.state.startTime; // this is miliseconds. not Second.


               if(diffTimeBetweenStartAndCurrent === 0){
                   diffTimeBetweenStartAndCurrent = 1;
               }

               const speedPerOneMilisecond = ((loaded - this.state.lastLoaded) / diffTimeBetweenStartAndCurrent);

               const speedPerSecond = speedPerOneMilisecond * 1000;



                this.setState({
                    speedUpload: speedPerSecond,
                    startTime: currentTime,
                    lastLoaded: loaded,
                    loaded: loaded,
                    total: total,
                    percentage:percentage
                });

                break;

            default:

                break;
        }


    }
    render(){

    const {percentage, data,total,loaded,speedUpload} = this.state;

    const totalFiles = _.get(data, 'files', []).length;

        return (
            <div className={'app-card app-card-uploading'}>

                    <div className={'app-card-content'}>
                        <div className={'app-card-content-inner'}>

                            <div className={'app-home-uploading'}>

                                <div className={'app-home-uploading-icon'}>

                                    <i className={'icon-upload'} />
                                    <h2>Sending...</h2>
                                </div>

                                <div className={'app-upload-files-total'}>Uploading {totalFiles} files.</div>


                                <div className={'app-progress'}>
                                    <span style={{width: `${percentage}%`}} className={'app-progress-bar'} />
                                </div>

                                <div className={'app-upload-stats'}>
                                    <div className={'app-upload-stats-left'}>{betterNumber(loaded)}/{betterNumber(total)}</div>
                                    <div className={'app-upload-stats-right'}>{betterNumber(speedUpload)}/s</div>
                                </div>

                                <div className={'app-form-actions'}>
                                    <button onClick={() => {

                                        if(this.props.onCancel){
                                            this.props.onCancel(true)
                                        }
                                    }} className={'app-upload-cancel-button app-button'} type={'button'}>Cancel</button>
                                </div>

                            </div>
                        </div>
                    </div>

            </div>
        )
    }

}

class HomeUploadSent extends React.Component{

    constructor(props){
        super(props);

    }

    render(){

        const {data} = this.props;

        console.log("Data", data);

        const to = _.get(data, 'to');
        const postId = _.get(data, '_id');
        return (
            <div className={'app-card app-card-upload-sent'}>

                <div className={'app-card-content'}>
                    <div className={'app-card-content-inner'}>

                        <div className={'app-home-uploading'}>

                            <div className={'app-home-upload-sent-icon'}>

                                <i className={'icon-paperplane'} />
                            </div>


                            <div className={'app-upload-sent-message app-text-center'}>
                                <h2>Files sent!</h2>
                                <p>We're sent an email to {to} with a download link. The link will expire in 30 days.</p>
                            </div>
                            <div className={'app-upload-sent-actions app-form-actions'}>
                                <button onClick={()=> {
                                    if(this.props.onSendAnotherFile){
                                        this.props.onSendAnotherFile(true);
                                    }
                                }} className={'app-button'} type={'button'}>Send another file</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


class Home extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            componentName: 'HomeForm',
            data: null,
            uploadEvent: null,
        };


        this._renderComponent = this._renderComponent.bind(this)

    }


    _renderComponent() {

        const {componentName, data, uploadEvent} = this.state;

        var delay = ( function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();

        switch (componentName) {

            case 'HomeUploading':

                return <HomeUploading event={uploadEvent} data={data}/>


            case 'HomeUploadSent':


                return (
                    <HomeUploadSent onSendAnotherFile={() => {

                        this.setState({
                            componentName: 'HomeForm'
                        })

                    }} data={data}/>
                );


            default:
                return <HomeForm
                    onUploadEvent={(event) => {

                        let data = this.state.data;

                        if(_.get(event, 'type') === 'success'){

                            data = _.get(event, 'payload');
                        }

                        this.setState(
                            {
                                data: data,
                                uploadEvent: event,
                                componentName: (_.get(event, 'type') === 'success') ? 'HomeUploadSent': this.state.componentName,
                            }
                        );


                    }}

                    onUploadBegin={(data) => {

                        this.setState({
                            data: data,
                            componentName: 'HomeUploading',
                        });

                    }}/>
                return
        }
    }

    render() {

        return (

            <div className={'app-container'}>
                <div className={'app-content'}>
                    {this._renderComponent()}
                </div>
            </div>
        )
    }
}

ReactDOM.render(<Home />, document.getElementById('root'));