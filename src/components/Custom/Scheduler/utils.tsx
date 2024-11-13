import { IClient } from "@/stores/models/IClient";
import { IObjectReservation, IReservation } from "@/stores/models/IReservation";
import { reservationStatus } from "@/vars";

export const getObjectReservations = (reservations: IReservation[]) => {
    return reservations.reduce((acc, reservation) => {
        // Ищем объект по его id в аккумуляторе
        const existingObject = acc.find(
            (item) => item.id === reservation.object.id
        );

        if (existingObject) {
            // Если объект найден, добавляем новую резервацию
            existingObject.reservations.push({
                id: reservation.id,
                start_date: reservation.start_date,
                end_date: reservation.end_date,
                status: reservation.status,
                description: reservation.description,
                letter: reservation.letter,
                client: reservation.client,
            });

            // Сортируем массив reservations по start_date
            existingObject.reservations.sort((a, b) => {
                return (
                    new Date(a.start_date).getTime() -
                    new Date(b.start_date).getTime()
                );
            });
        } else {
            // Если объект не найден, создаем новый элемент
            acc.push({
                id: reservation.object.id,
                name: reservation.object.name,
                reservations: [
                    {
                        id: reservation.id,
                        start_date: reservation.start_date,
                        end_date: reservation.end_date,
                        status: reservation.status,
                        description: reservation.description,
                        letter: reservation.letter,
                        client: reservation.client,
                    },
                ],
            });
        }

        return acc;
    }, [] as IObjectReservation[]);
};

export const sortAndSetOrder = (objectReservations: IObjectReservation[]) => {
    objectReservations.forEach((object) => {
        // Сортируем бронирования по start_date
        object.reservations.sort(
            (a, b) =>
                new Date(a.start_date).getTime() -
                new Date(b.start_date).getTime()
        );

        let lastEndDate: string | null = null; // Отслеживаем end_date последней брони
        let currentOrder = 0; // Начальный order

        // Перебираем отсортированные бронирования
        object.reservations.forEach((reservation, index) => {
            // Если это первое бронирование или текущее бронирование начинается после окончания предыдущего,
            // то начинаем новую группу и сбрасываем order на 0
            if (
                lastEndDate === null ||
                new Date(reservation.start_date).getTime() >
                    new Date(lastEndDate).getTime()
            ) {
                reservation.order = 0; // Сбрасываем order для новой группы
                currentOrder = 0; // Сбрасываем currentOrder
                lastEndDate = reservation.end_date; // Обновляем lastEndDate
            } else {
                // Если текущее бронирование перекрывает предыдущее, то продолжаем увеличивать order
                reservation.order = currentOrder + 1; // Увеличиваем order для перекрывающейся группы
                currentOrder++; // Инкрементируем для следующей брони в группе
            }
        });
    });

    return objectReservations;
};

export const getMaxConcurrentReservations = (
    reservations: IReservation[]
): number => {
    // Создаём массив событий для старта и конца каждой резервации
    const events = reservations.flatMap((reservation) => [
        { type: "start", date: new Date(reservation.start_date).getTime() },
        { type: "end", date: new Date(reservation.end_date).getTime() },
    ]);

    // Сортируем события: сначала по дате, затем по типу (окончание до начала, если даты равны)
    events.sort((a, b) => {
        if (a.date === b.date) {
            return a.type === "start" ? 1 : -1; // Окончание должно идти до начала
        }
        return a.date - b.date;
    });

    let maxConcurrent = 0;
    let currentConcurrent = 0;

    // Проходим по отсортированным событиям
    for (const event of events) {
        if (event.type === "start") {
            currentConcurrent++; // Увеличиваем количество одновременных резерваций
            maxConcurrent = Math.max(maxConcurrent, currentConcurrent); // Обновляем максимальное значение
        } else {
            currentConcurrent--; // Уменьшаем количество одновременных резерваций
        }
    }

    return maxConcurrent;
};

export const getEarliestDate = (reservations: IReservation[]) => {
    return reservations.reduce((earliest, current) => {
        return new Date(current.start_date) < new Date(earliest.start_date)
            ? current
            : earliest;
    }).start_date;
};
