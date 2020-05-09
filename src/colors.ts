export interface Color {
    name: string;
    id: number;
    value: string;
};

export const getColors = (): Color[] => {
    return [
        { name: "Berry Red", id: 30, value: "#b8255f" },
        { name: "Red", id: 31, value: "#db4035" },
        { name: "Orange", id: 32, value: "#ff9933" },
        { name: "Yellow", id: 33, value: "#fad000" },
        { name: "Olive Green", id: 34, value: "#afb83b" },
        { name: "Live Green", id: 35, value: "#7ecc49" },
        { name: "Green", id: 36, value: "#299438" },
        { name: "Mint Green", id: 37, value: "#6accbc" },
        { name: "Turquoise", id: 38, value: "#158fad" },
        { name: "Sky Blue", id: 39, value: "#14aaf5" },
        { name: "Light Blue", id: 40, value: "#96c3eb" },
        { name: "Blue", id: 41, value: "#4073ff" },
        { name: "Grape", id: 42, value: "#884dff" },
        { name: "Violet", id: 43, value: "#af38eb" },
        { name: "Lavender", id: 44, value: "#eb96eb" },
        { name: "Magenta", id: 45, value: "#e05194" },
        { name: "Salmon", id: 46, value: "#ff8d85" },
        { name: "Charcoal", id: 47, value: "#808080" },
        { name: "Gray", id: 48, value: "#b8b8b8" },
        { name: "Taupe", id: 49, value: "#ccac93" },
    ]
};

export const getColor = (colorId: number) => {
    if (colorId < 30 || colorId > 49) {
        throw new Error("Invalid ")
    }

    const colors = getColors().filter(x => x.id === colorId);
    return colors[0];
}