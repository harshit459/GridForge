export class Toolbar {
    constructor(container) {
        this.container = container;
    }

    render() {
        // bold button
        const boldButton = document.createElement("button");

        boldButton.textContent = "B";
        boldButton.type = "button";
        boldButton.classList.add("toolbar-button");

        this.container.appendChild(boldButton);

        this.boldButton = boldButton;

        // italic button
        const italicButton = document.createElement("button");

        italicButton.textContent = "I";
        italicButton.type = "button";
        italicButton.classList.add("toolbar-button");

        this.container.appendChild(italicButton);

        this.italicButton = italicButton;

        // font size select
        const fontSizeSelect = document.createElement("select");

        const sizes = [10, 12, 14, 16, 18, 20, 24];

        for (const size of sizes) {
            const option = document.createElement("option");

            option.value = size;
            option.textContent = size;

            fontSizeSelect.appendChild(option);
        }

        fontSizeSelect.value = 14;

        this.container.appendChild(fontSizeSelect);

        this.fontSizeSelect = fontSizeSelect;

        // alignment select
        const alignmentSelect = document.createElement("select");

        const alignments = [
            ["left", "Left"],
            ["center", "Center"],
            ["right", "Right"]
        ];

        for (const [value, label] of alignments) {
            const option = document.createElement("option");

            option.value = value;
            option.textContent = label;

            alignmentSelect.appendChild(option);
        }

        alignmentSelect.value = "left";

        this.container.appendChild(alignmentSelect);

        this.alignmentSelect = alignmentSelect;
    }
}