import "@/assets/css/vendors/tabulator.css";
import clsx from "clsx";
import Button from "@/components/Base/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormInput, FormTextarea } from "@/components/Base/Form";
import { useState } from "react";
import { startLoader, stopLoader } from "@/utils/customUtils";
import OverlayLoader from "@/components/Custom/OverlayLoader/Loader";
import ValidationErrorNotification from "@/components/Custom/ValidationErrorNotification";

function MailPreview() {
    return (
        <>
            <div className="p-5">
                <div className="mt-5 text-lg font-bold text-center">
                    Приветственное письмо
                </div>
                <div className="mt-5">
                    <div className="mt-3 border-b">
                        <h3 className="flex flex-col mb-2 w-full sm:flex-row text-xl">
                            Добро пожаловать в Stayflex
                        </h3>
                    </div>
                    <div className="mt-3 text-box">
                        <p>
                            С другой стороны новая модель организационной
                            деятельности влечет за собой процесс внедрения и
                            модернизации соответствующий условий активизации.
                            Значимость этих проблем настолько очевидна, что
                            реализация намеченных плановых заданий позволяет
                            оценить значение новых предложений. Не следует,
                            однако забывать, что укрепление и развитие структуры
                            позволяет выполнять важные задания по разработке
                            направлений прогрессивного развития. Повседневная
                            практика показывает, что новая модель
                            организационной деятельности в значительной степени
                            обуславливает создание новых предложений.
                        </p>
                        <p>
                            Задача организации, в особенности же дальнейшее
                            развитие различных форм деятельности позволяет
                            выполнять важные задания по разработке систем
                            массового участия. Значимость этих проблем настолько
                            очевидна, что начало повседневной работы по
                            формированию позиции требуют определения и уточнения
                            позиций, занимаемых участниками в отношении
                            поставленных задач. Не следует, однако забывать, что
                            сложившаяся структура организации требуют от нас
                            анализа новых предложений. Разнообразный и богатый
                            опыт новая модель организационной деятельности
                            позволяет оценить значение дальнейших направлений
                            развития. Разнообразный и богатый опыт сложившаяся
                            структура организации представляет собой интересный
                            эксперимент проверки форм развития.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MailPreview;
