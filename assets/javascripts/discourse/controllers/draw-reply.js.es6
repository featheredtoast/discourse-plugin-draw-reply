import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
    pictureData: "test",

    actions: {
        draw: function(pictureData) {
            console.log("setting picture data to: " + pictureData);
            this.set("pictureData", pictureData);
        },
        apply: function() {
            var output = this.get("pictureData"), self = this;

            //TODO: do something here to send canvas data
            if (self.composerViewOld)
                self.composerViewOld.addMarkdown(output);
            else if (self.composerView)
                self.composerView._addText(self.composerView._getSelected(), output);

            this.send('closeModal');
        }
    },

    onShow: function() {
    },

    init: function () {
        this._super();

    }
});
