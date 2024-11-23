// placeholder/placeholderui.js

import {
    Plugin,
    ViewModel,
    addListToDropdown,
    createDropdown,
    Collection,
    icons,
} from "ckeditor5";

export default class PlaceholderUI extends Plugin {
    init() {
        const editor = this.editor;
        const t = editor.t;
        const placeholderNames = editor.config.get("placeholderConfig.types");
        //@ts-ignore
        if (!placeholderNames.length) return;

        // The "placeholder" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add("placeholder", (locale) => {
            const dropdownView = createDropdown(locale);
            // Populate the list in the dropdown with items.
            addListToDropdown(
                dropdownView,
                //@ts-ignore

                getDropdownItemsDefinitions(
                    //@ts-ignore
                    placeholderNames.map((name) => name)
                )
            );

            dropdownView.buttonView.set({
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t("*"),
                tooltip: t("Insert contruction"),
                withText: true,
                icon: icons.codeBlock,
                class: "placeholder",
            });

            // Disable the placeholder button when the command is disabled.
            const command = editor.commands.get("placeholder");
            //@ts-ignore
            dropdownView.bind("isEnabled").to(command);

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo(dropdownView, "execute", (evt) => {
                //@ts-ignore
                editor.execute("placeholder", {
                    //@ts-ignore
                    value: evt.source.commandParam,
                    //@ts-ignore
                    title: evt.source.attributes.title,
                });
                editor.editing.view.focus();
            });

            return dropdownView;
        });
    }
}

function getDropdownItemsDefinitions(placeholderNames: any) {
    const itemDefinitions = new Collection();

    for (const name of placeholderNames) {
        const definition = {
            type: "button",
            model: new ViewModel({
                commandParam: name.construction,
                label: name.title,
                withText: true,
                class: name.class + " construction",
                attributes: { title: name.title },
            }),
        };

        // Add the item definition to the collection.
        itemDefinitions.add(definition);
    }

    return itemDefinitions;
}
