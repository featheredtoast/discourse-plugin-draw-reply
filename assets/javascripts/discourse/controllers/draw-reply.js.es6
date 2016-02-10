import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
    pictureData: "",

    actions: {
        draw: function(pictureData) {
            console.log("setting picture data to: " + pictureData);
            this.set("pictureData", pictureData);
        },
        apply: function() {
            var blob = this.get("pictureData"),
                self = this;

            //TODO: do something here to send canvas data
            $(".d-editor-input").fileupload('add', {files: blob});

            this.send('closeModal');
        }
    },

    onShow: function() {
    },

    init: function () {
        this._super();

    }
});
