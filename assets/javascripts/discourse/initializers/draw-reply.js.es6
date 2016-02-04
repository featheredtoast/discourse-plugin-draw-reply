import showModal from 'discourse/lib/show-modal';
import ApplicationRoute from 'discourse/routes/application';
import ComposerView from 'discourse/views/composer';
import { onToolbarCreate } from 'discourse/components/d-editor';
import NewComposer from 'discourse/components/d-editor';

export default
{
    name: 'draw-reply',
    initialize(container)
    {
        const siteSettings = container.lookup('site-settings:main');

        if (siteSettings.replygif_enabled) {
            if (NewComposer !== "undefined") {
                NewComposer.reopen({
                    actions: {
                        showDrawReply: function() {
                            showModal('draw-reply').setProperties({composerView: this});
                        }
                    }
                });

                onToolbarCreate(toolbar => {
                    toolbar.addButton({
                        id: "drawreply_button",
                        group: "extras",
                        icon: "pencil-square-o",
                        action: 'showDrawReply'
                    });
                });
            } else {
                ApplicationRoute.reopen({
                    actions: {
                        showDrawReply: function (composerView) {
                            showModal('draw-reply');
                            this.controllerFor('draw-reply').setProperties({composerViewOld: composerView});
                        }
                    }
                });

                ComposerView.reopen({
                    initEditor: function () {
                        // overwrite and wrap.
                        this._super();
                        var view = this;
                        var button_text = "OMG TEXT"
                        var btn = $('<button class="wmd-button wmd-draw-reply-button" title="' + button_text + '" aria-label="' + button_text + '"></button>');
                        btn.click(function () {
                            view.get("controller").send("showDrawReply", view);
                        });
                        $("#wmd-button-row,.wmd-button-row").append(btn);
                    }
                });
            }
        }
    }
};
