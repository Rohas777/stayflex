import { IObjectReservation, IReservation } from "@/stores/models/IReservation";

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
