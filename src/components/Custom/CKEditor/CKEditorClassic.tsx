import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Clipboard, EventInfo } from "ckeditor5";
import Placeholder from "@/components/Custom/CKEditorPlugins/ConstructionList/placeholder";
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
import React from "react";

interface CKEditorClassicProps {
    editorData: string;
    onChange: (event: EventInfo, editor: ClassicEditor) => void;
    onReady?: () => void;
    initialData?: string;
    id?: string;
}
function CKEditorClassic(props: CKEditorClassicProps) {
    const { editorData, onChange, onReady, initialData, ...computedProps } =
        props;

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
                toolbar: [
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
                ],
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
                ],
                initialData: initialData,
            }}
        />
    );
}

export default CKEditorClassic;
