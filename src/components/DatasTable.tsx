/**
 * Merci de laisser ce bloc de commentaires afin de respecter le travail de l'auteur.
 * Datas table component : créé par Alexandre DUBUS
 * GitHub : https://github.com/alebus84
 */

import React, {ReactElement, useEffect, useRef, useState} from 'react';
import '../prefixedStyles/DatasTable.css';

function DatasTable(props: {

    datas: null | {headers: object, rows: object[]}

}): ReactElement {

    /**
     * States :
     */

    const [datas, setDatas]: [null | {headers: object, pages: object[]}, React.Dispatch<React.SetStateAction<null | {headers: object, pages: object[]}>>] = useState<null | {headers: object, pages: object[]}>(null);
    const [columnsSizes, setColumnsSizes]: [null | number[], React.Dispatch<React.SetStateAction<null | number[]>>] = useState<null | number[]>(null);
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState<number>(0);
    const document: React.RefObject<any> = useRef<any>(window);
    const wrapper: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const table: React.RefObject<HTMLTableElement> = useRef<HTMLTableElement>(null);
    const headers: React.RefObject<HTMLTableCellElement[]> = useRef<HTMLTableCellElement[]>([]);
    const footer: React.RefObject<HTMLTableCellElement> = useRef<HTMLTableCellElement>(null);

    /**
     * Hooks :
     */

    useEffect((): () => void => {
        if (props.datas !== null) {
            defineColumnsSizes(props.datas);
            paginateDatas(props.datas);
        }
        return (): void => {
            setDatas(null);
            setColumnsSizes(null);
        };
    }, []);

    useEffect((): void => {
        if (props.datas !== null) {
            defineColumnsSizes(props.datas);
            paginateDatas(props.datas);
        }
    }, [props.datas]);

    useEffect((): void => {
        if (
            columnsSizes !== null &&
            wrapper.current !== null &&
            table.current !== null &&
            headers.current !== null &&
            headers.current.length !== 0 &&
            footer.current !== null
        ) defineElementsSizes();
    });

    useEffect((): void => {
        if (
            columnsSizes !== null &&
            document.current !== null
        ) document.current.addEventListener("resize", defineElementsSizes);
    });

    /**
     * Behaviours :
     */

    // Définition des tailles de colonnes par défaut :
    const defineColumnsSizes: (sizesToDefine: {headers: object; rows: object[]}) => void = (sizesToDefine: {headers: object; rows: object[]}): void => {
        const definedSizes: number[] = Object.entries(sizesToDefine.headers).filter(([key,]: [string, any],): boolean => key === "sizes")[0][1];
        setColumnsSizes(definedSizes);
    };

    // Pagination des données :
    const paginateDatas: (datasToPaginate: {headers: object; rows: object[]}) => void = (datasToPaginate: {headers: object, rows: object[]}): void => {
        const paginatedDatas: {headers: object, pages: object[]} = {headers: datasToPaginate.headers, pages: []};
        const displayLimit: number = 10;
        const numberOfPages: number = Math.ceil(datasToPaginate.rows.length / displayLimit);
        let pageNumber: number = 0;
        let rangeStart: number = 0;
        let rangeEnd: number = displayLimit - 1;
        for (pageNumber; pageNumber < numberOfPages; pageNumber++) {
            paginatedDatas.pages.push(datasToPaginate.rows.filter((data: object, dataIndex: number): boolean => dataIndex >= rangeStart && dataIndex <= rangeEnd));
            rangeStart += displayLimit;
            rangeEnd += displayLimit;
        }
        setDatas(paginatedDatas);
    };

    // Définition des tailles de différents éléments du composant :
    const defineElementsSizes: (event?: any) => void = (event: undefined | any = undefined): void => {
        if (event !== undefined) event.preventDefault();
        const wrapperToResize: HTMLDivElement = event !== undefined
            ? event.target.document.querySelector("#wrapper-of-datas-table-component")
            : wrapper.current;
        const tableToResize: HTMLTableElement = event !== undefined
            ? event.target.document.querySelector("#wrapper-of-datas-table-component table")
            : table.current;
        const headersToResize: HTMLTableCellElement[] = event !== undefined
            ? event.target.document.querySelector("#wrapper-of-datas-table-component").querySelectorAll("th")
            : headers.current;
        const footerToResize: HTMLTableCellElement = event !== undefined
            ? event.target.document.querySelector("#wrapper-of-datas-table-component").querySelector("tfoot td")
            : footer.current;
        const columnsSizesCopy: number[] = columnsSizes!;
        let sum: number = 0;
        columnsSizesCopy.forEach((size: number): number => sum += size);
        const sizeOfWrapperToResize: number = wrapperToResize.clientWidth;
        const difference: number = sizeOfWrapperToResize - sum;
        tableToResize.style.width = sum < sizeOfWrapperToResize ? `${sum + difference}px` : `${sum}px`;
        let i: number = 0;
        headersToResize.forEach((header: HTMLElement): void => {
            header.style.width = `${(columnsSizesCopy[i] * 100) / sum}%`;
            i++;
        });
        footerToResize.setAttribute("colspan", `${headersToResize.length}`);
    };

    // Fonctionnalité utilisateur de tri de colonne :
    const handleSortColumn: (event: any) => void = (event: any): void => {
        event.preventDefault();
        const headerOfSelectedColumn: HTMLTableCellElement = event.target.offsetParent;
        const label: string = headerOfSelectedColumn.attributes.getNamedItem("aria-label")!.value;
        const direction: "ascending" | "descending" = headerOfSelectedColumn.attributes.getNamedItem("aria-sort")!.value as "ascending" | "descending";
        const button: HTMLButtonElement = headerOfSelectedColumn.querySelector("button")!;
        const datasCopy: {headers: object, pages: object[]} = datas!;
        const datasToSort: object[] = [];
        datasCopy.pages.forEach((page: object): void => {
            (page as object[]).forEach((data: object): number => datasToSort.push(data));
        });
        const sortedDatas: {headers: object; rows: object[]} = {headers: datasCopy.headers, rows: []};
        sortedDatas.rows = direction === "ascending"
            ? datasToSort
                .sort((currentData: object, nextData: object): 1 | -1 => (
                    (currentData as any).rowContent[`${label}`]
                        .localeCompare(
                            (nextData as any).rowContent[`${label}`],
                            "fr",
                            {sensitivity: "base", numeric: "true"}
                        ) > 0
                ) ? 1 : -1)
            : datasToSort
                .sort((currentData: object, nextData: object): 1 | -1 => (
                    (currentData as any).rowContent[`${label}`]
                        .localeCompare(
                            (nextData as any).rowContent[`${label}`],
                            "fr",
                            {sensitivity: "base", numeric: "true"}
                        ) < 0
                ) ? 1 : -1);
        paginateDatas(sortedDatas);
        headerOfSelectedColumn.setAttribute("aria-sort", `${direction === "ascending" ? "descending" : "ascending"}`);
        button.setAttribute("class", `${direction === "ascending" ? "descending" : "ascending"}`);
    };

    // Fonctionnalité utilisateur de redimensionnement de colonne :
    const handleResizeColumn: (event: any) => void = (event: any): void => {
        event.preventDefault();
        let columnsSizesCopy: number[] = columnsSizes!;
        const document: any = event.view.document;
        const currentPositionOfMouse: number = event.clientX;
        const indexOfSelectedColumn: number = event.target.offsetParent.cellIndex;
        const table: HTMLTableElement = event.target.offsetParent.parentElement.offsetParent;
        const currentSizeOfTable: number = table.clientWidth;
        const headerOfSelectedColumn: HTMLTableCellElement = (Array.from(table.querySelectorAll("th")) as HTMLTableCellElement[])
            .filter((header: HTMLTableCellElement): boolean => header.cellIndex === indexOfSelectedColumn)[0];
        const othersHeaders: HTMLTableCellElement[] = (Array.from(table.querySelectorAll("th")) as HTMLTableCellElement[])
            .filter((header: HTMLTableCellElement): boolean => header !== headerOfSelectedColumn);
        const currentSizeOfSelectedColumn: number = headerOfSelectedColumn.clientWidth;
        const resizersOfSelectedColumn: HTMLDivElement[] = (Array.from(table.querySelectorAll(".resizer")) as HTMLDivElement[])
            .filter((resizer: HTMLDivElement): boolean => (resizer.offsetParent as HTMLTableCellElement).cellIndex === indexOfSelectedColumn);
        document.removeEventListener("resize", defineElementsSizes);
        const handleMouseMove: (event: any) => void = (event: any): void => {
            const coveredDistance: number = event.clientX - currentPositionOfMouse;
            table.style.width = `${currentSizeOfTable + coveredDistance}px`;
            headerOfSelectedColumn.style.width = `${currentSizeOfSelectedColumn + coveredDistance}px`;
            columnsSizesCopy[indexOfSelectedColumn] = currentSizeOfSelectedColumn + coveredDistance;
        };
        document.addEventListener("mousemove", handleMouseMove);
        const handleMouseUp: () => void = (): void => {
            table.style.tableLayout = "fixed";
            resizersOfSelectedColumn.forEach((resizer: HTMLDivElement): void => (resizer.classList.remove("resizing")));
            setColumnsSizes(columnsSizesCopy);
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.addEventListener("resize", defineElementsSizes);
        };
        document.addEventListener("mouseup", handleMouseUp);
        table.style.removeProperty("table-layout");
        resizersOfSelectedColumn.forEach((resizer: HTMLDivElement): void => (resizer.classList.add("resizing")));
        othersHeaders.forEach((header: HTMLTableCellElement): string => (header.style.width = `${header.clientWidth}px`));
    };

    // Fonctionnalité utilisateur de changement de page :
    const handleChangePage: (event: any) => void = (event: any): void => {
        event.preventDefault();
        setCurrentPage(Number(event.target.textContent) - 1);
    };

    /**
     * Rendering :
     */

    return (
        <div ref={wrapper} id="wrapper-of-datas-table-component">
            <table ref={table}>
                <caption>Datas table component</caption>
                {datas !== null && Object.entries(datas.headers).map(([key, titles]: [string, any], index: number): boolean | ReactElement => (key === "titles" &&
                <thead key={index}>
                    <tr>{Object.entries(titles).map(([key, title]: [string, any], index: number): ReactElement => (
                        <th ref={(header: HTMLTableCellElement): HTMLTableCellElement => (headers.current![index] = header)} key={index} aria-label={key} aria-sort="ascending">
                            <div className="cell-content">
                                <button className="ascending" onClick={handleSortColumn}></button>
                                <span>{title}</span>
                            </div>
                            <div className="resizer" onMouseDown={handleResizeColumn}></div>
                        </th>
                    ))}</tr>
                </thead>))}
                {datas !== null && datas.pages.map((page: any, pageIndex: number): boolean | ReactElement => (pageIndex === currentPage &&
                <tbody key={pageIndex}>{page.map((row: any): ReactElement => (
                    <tr key={row.rowIndex}>{Object.values(row.rowContent).map((cell: any, cellIndex: number): ReactElement => (
                        <td key={cellIndex}>
                            <div className="cell-content">{cell}</div>
                            <div className="resizer" onMouseDown={handleResizeColumn}></div>
                        </td>
                    ))}</tr>
                ))}</tbody>))}
                <tfoot>
                    <tr>
                        <td ref={footer}>
                            <div className="wrapper-of-pagination">
                                <p>Pages ({datas !== null && datas.pages.length}) :</p>
                                <ul>{datas !== null && datas.pages.map((page: any, pageNumber: number): null | ReactElement => (pageNumber >= currentPage - 3 && pageNumber <= currentPage + 3 ? pageNumber === currentPage
                                    ? <li key={pageNumber} className="current-page">{pageNumber + 1}</li>
                                    : <li key={pageNumber} onClick={handleChangePage}>{pageNumber + 1}</li>
                                : null))}</ul>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );

}

export default DatasTable;