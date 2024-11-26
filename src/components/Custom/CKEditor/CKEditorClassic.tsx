import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
    ClassicEditor,
    Clipboard,
    Editor,
    EditorConfig,
    EventInfo,
    PluginConstructor,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "@/assets/css/vendors/ckeditor.css";
import {
    Bold,
    Essentials,
    Italic,
    List,
    Mention,
    Paragraph,
    Undo,
    Heading,
    Link,
    FontSize,
} from "ckeditor5";
import Placeholder from "../CKEditorPlugins/ConstructionList/placeholder";
import { useEffect, useState } from "react";

interface CKEditorClassicProps {
    editorData: string;
    onChange: (event: EventInfo, editor: ClassicEditor) => void;
    onReady?: () => void;
    initialData?: string;
    config?: EditorConfig;
    id?: string;
}
function CKEditorClassic(props: CKEditorClassicProps) {
    const [plugins, setPlugins] = useState<
        (string | PluginConstructor<Editor>)[]
    >([]);
    const [items, setItems] = useState<string[]>([]);

    const {
        editorData,
        onChange,
        onReady,
        initialData,
        config,
        ...computedProps
    } = props;

    useEffect(() => {
        if (config && config.plugins) {
            setPlugins(config.plugins);
        } else {
            setPlugins([]);
        }
        //@ts-ignore
        if (config && config.toolbar && config.toolbar.items) {
            //@ts-ignore
            setItems(config.toolbar.items);
        } else {
            setItems([]);
        }
    }, [config]);

    return (
        <CKEditor
            {...computedProps}
            editor={ClassicEditor}
            data={editorData}
            onReady={() => {
                onReady && onReady();
            }}
            onChange={onChange}
            config={{
                ...config,
                toolbar: {
                    items: [
                        "heading",
                        "fontSize",
                        "|",
                        "bold",
                        "italic",
                        "link",
                        "numberedList",
                        "bulletedList",
                        "|",
                        "undo",
                        "redo",
                        ...items,
                    ],
                },
                plugins: [
                    Bold,
                    Essentials,
                    Italic,
                    Mention,
                    Paragraph,
                    Undo,
                    List,
                    Link,
                    Heading,
                    FontSize,
                    Clipboard,
                    Placeholder,
                    ...plugins,
                ],
                initialData: initialData,
            }}
        />
    );
}

export default CKEditorClassic;
