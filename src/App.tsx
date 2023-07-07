import React, {ReactElement, useEffect, useState} from 'react';
import './App.css';
import DatasTable from "./components/DatasTable";

function App(): ReactElement {

    /**
     * States :
     */

    const [datas, setDatas]: [null | {headers: object, rows: object[]}, React.Dispatch<React.SetStateAction<null | {headers: object, rows: object[]}>>] = useState<null | {headers: object, rows: object[]}>(null);

    /**
     * Hooks :
     */

    useEffect((): () => void => {
        getDatas();
        return (): void => {
            setDatas(null);
        };
    }, []);

    /**
     * Behaviours :
     */

    // Récupération des données depuis la BDD :
    const getDatas: () => void = (): void => {
        const datasSource: object[] = [
            {id: 1, civility: "M", firstName: "Emmanuel", lastName: "MACRON", email: "emmanuel.macron@mail.fr"},
            {id: 2, civility: "Mme", firstName: "Brigitte", lastName: "MACRON", email: "brigitte.macron@mail.fr"},
            {id: 3, civility: "M", firstName: "Éric", lastName: "DUPOND-MORETTI", email: "eric.dupond-moretti@mail.fr"},
            {id: 4, civility: "M", firstName: "Olivier", lastName: "VÉRAN", email: "olivier.veran@mail.fr"},
            {id: 5, civility: "M", firstName: "Didier", lastName: "DESCHAMPS", email: "didier.deschamps@mail.fr"},
            {id: 6, civility: "M", firstName: "Matthieu", lastName: "CHEDID", email: "matthieu.chedid@mail.fr"},
            {id: 7, civility: "Mme", firstName: "Laure", lastName: "MANAUDOU", email: "laure.manaudou@mail.fr"},
            {id: 8, civility: "Mme", firstName: "Céline", lastName: "DION", email: "celine.dion@mail.fr"},
            {id: 9, civility: "M", firstName: "Jean-Marie", lastName: "BIGARD", email: "jean-marie.bigard@mail.fr"},
            {id: 10, civility: "Mme", firstName: "Florence", lastName: "FORESTI", email: "florence.foresti@mail.fr"},

            {id: 11, civility: "M", firstName: "Jean-Jacques", lastName: "GOLDMAN", email: "jean-jacques.goldman@mail.fr"},
            {id: 12, civility: "M", firstName: "Thomas", lastName: "PESQUET", email: "thomas.pesquet@mail.fr"},
            {id: 13, civility: "M", firstName: "Omar", lastName: "SY", email: "omar.sy@mail.fr"},
            {id: 14, civility: "M", firstName: "Kylian", lastName: "MBAPPE", email: "kylian.mbappe@mail.fr"},
            {id: 15, civility: "M", firstName: "Florent", lastName: "PAGNY", email: "florent.pagny@mail.fr"},
            {id: 16, civility: "M", firstName: "Philippe", lastName: "ETCHEBEST", email: "philippe.etchebest@mail.fr"},
            {id: 17, civility: "M", firstName: "Olivier", lastName: "GIROUD", email: "olivier.giroud@mail.fr"},
            {id: 18, civility: "M", firstName: "Michel", lastName: "SARDOU", email: "michel.sardou@mail.fr"},
            {id: 19, civility: "M", firstName: "Antoine", lastName: "GRIEZMANN", email: "antoine.griezmann@mail.fr"},
            {id: 20, civility: "M", firstName: "Francis", lastName: "CABREL", email: "francis.cabrel@mail.fr"},

            {id: 21, civility: "M", firstName: "Cyril", lastName: "LIGNAC", email: "cyril.lignac@mail.fr"},
            {id: 22, civility: "M", firstName: "Jean", lastName: "RENO", email: "jean.reno@mail.fr"},
            {id: 23, civility: "M", firstName: "Zinédine", lastName: "ZIDANE", email: "zinedine.zidane@mail.fr"},
            {id: 24, civility: "M", firstName: "Stéphane", lastName: "PLAZA", email: "stephane.plaza@mail.fr"},
            {id: 25, civility: "M", firstName: "Julien", lastName: "DORÉ", email: "julien.dore@mail.fr"},
            {id: 26, civility: "M", firstName: "Hugo", lastName: "Lloris", email: "hugo.lloris@mail.fr"},
            {id: 27, civility: "M", firstName: "Dany", lastName: "BOON", email: "dany.boon@mail.fr"},
            {id: 28, civility: "M", firstName: "Jean-Luc", lastName: "REICHMANN", email: "jean-luc.reichmann@mail.fr"},
            {id: 29, civility: "M", firstName: "Teddy", lastName: "RINER", email: "teddy.riner@mail.fr"},
            {id: 30, civility: "M", firstName: "Stéphane", lastName: "BERN", email: "stephane.bern@mail.fr"}
        ];
        setDatas(structureDatas(datasSource));
    };

    // Formatage des données avant transmission au composant :
    const structureDatas: (datasToStructure: object[]) => {headers: object, rows: object[]} = (datasToStructure: object[]): {headers: object, rows: object[]} => {

        /*
        Le schéma structurel des données à transmettre au composant est le suivant :

        // Un objet global à transmettre au composant.
        {

            // Un objet qui va contenir des paramètres nécessaires au <thead> de la <table>.
            headers: {

                // Un tableau qui va contenir une liste de nombres qui vont définir la largeur par défaut des colonnes.
                sizes: [number, number, number...],

                // Un objet qui va contenir une liste de paires "clé: valeur" qui vont définir les titres des colonnes.
                // La clé doit être identique à celle de la BDD.
                // La valeur doit être au format chaîne de caractères.
                titles: {key: value, key: value, key: value...}

            },

            // Un tableau qui va contenir une liste d'objets correspondant aux données à afficher dans le <tbody> de la <table>.
            rows: [

                // Schéma structurel de chaque objet :
                {

                    // Une paire "clé: valeur" qui va définir l'index de chaque ligne à l'affichage.
                    // Cet index doit être unique et au format nombre.
                    // Je recommande d'y attribuer l'index provenant de la BDD.
                    // Cet index unique permettra à React.js de détecter la moindre modification et donc d'actualiser automatiquement le composant.
                    rowIndex: number,

                    // Un objet qui va contenir la ligne de la BDD.
                    // La donnée doit être celle de la BDD sans modification.
                    // Les clés doivent être identiques à celles utilisées dans l'objet "titles".
                    rowContent: {key: value, key: value, key: value...}

                },

                ...

            ]

        }

        */

        const structuredDatas: {headers: object, rows: object[]} = {headers: [], rows: []};
        structuredDatas.headers = {
            sizes: [100, 200, 200, 300],
            titles: {civility: "Civilité", firstName: "Prénom", lastName: "Nom", email: "Adresse e-mail"}
        };
        datasToStructure.forEach((data: object): void => {
            const rowIndex: number = Object.entries(data).filter(([keyOfDataEntry,]: [string, number | string]): boolean => keyOfDataEntry === "id")[0][1];
            let dataCopy: any = data;
            delete dataCopy.id;
            const rowContent: object = dataCopy;
            const row: {rowIndex: number, rowContent: {}} = {rowIndex: rowIndex, rowContent: rowContent};
            structuredDatas.rows.push(row);
        });
        return structuredDatas;
    };

    /**
     * Rendering :
     */

    return (
        <div className="App">
            <DatasTable datas={datas}/>
        </div>
    );

}

export default App;