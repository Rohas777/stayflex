import React, { useEffect, useRef } from "react";
import { IMail } from "@/stores/models/IMail";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor, Clipboard, EditorConfig, EventInfo } from "ckeditor5";
import Placeholder from "@/components/Custom/CKEditorPlugins/ConstructionList/placeholder";
import "ckeditor5/ckeditor5.css";
import "@/assets/css/vendors/ckeditor.css";
import tippy from "tippy.js";

interface CKEditorWithConstructionsProps {
    constructions?: IMail["constructions"];
    editorData: string;
    onChange: (event: EventInfo, editor: ClassicEditor) => void;
    config?: EditorConfig;
    onReady?: () => void;
}
function CKEditorWithConstructions(props: CKEditorWithConstructionsProps) {
    const { constructions, editorData, onChange, onReady, config } = props;

    const addConstructionTooltips = () => {
        const constructionViews = document.querySelectorAll(
            ".placeholder.ck-widget"
        );
        constructionViews.forEach((constructionView) => {
            const elem = constructionView as HTMLElement;
            tippy(elem, {
                content: String(elem.getAttribute("data-title")),
                placement: "bottom",
                animation: "shift-away",
            });
        });
    };

    useEffect(() => {
        addConstructionTooltips();
    }, [editorData, constructions]);

    return (
        <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onReady={() => {
                addConstructionTooltips();
                onReady && onReady();
            }}
            onChange={onChange}
            config={{
                toolbar: {
                    items: [
                        //@ts-ignore
                        ...config?.toolbar?.items,
                        "|",
                        "placeholder",
                    ],
                },
                plugins: [
                    //@ts-ignore
                    ...config?.plugins,
                    Clipboard,
                    Placeholder,
                ],
                //@ts-ignore
                placeholderConfig: constructions
                    ? {
                          types: constructions.map((construction) => ({
                              title: construction.name,
                              construction: construction.construction,
                              class: construction.class,
                          })),
                      }
                    : undefined,
                initialData: config?.initialData,
            }}
        />
    );
}

export default CKEditorWithConstructions;
