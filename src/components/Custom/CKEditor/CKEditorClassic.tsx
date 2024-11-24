import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, EditorConfig, EventInfo } from "ckeditor5";
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

interface CKEditorClassicProps {
    editorData: string;
    onChange: (event: EventInfo, editor: ClassicEditor) => void;
    onReady?: () => void;
    initialData?: string;
    config?: EditorConfig;
    id?: string;
}
function CKEditorClassic(props: CKEditorClassicProps) {
    const {
        editorData,
        onChange,
        onReady,
        initialData,
        config,
        ...computedProps
    } = props;

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
                        //@ts-ignore
                        ...config?.toolbar.items,
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
                    //@ts-ignore
                    ...config?.plugins,
                ],
                initialData: initialData,
            }}
        />
    );
}

export default CKEditorClassic;
