class Tracker {

    constructor(){
        this.trackingInfo = {
            "macros":{
                "Energi, kcal": {"value": 0,"goal": 2000, "i": -1},
                "Protein, deklaration":{"value": 0,"goal": 60},
                "Kulhydrat, tilgængelig, deklaration":{"value": 0,"goal": 250, "i": -1},
                "Fedt, total":{"value": 0,"goal": 40, "i": -1},
                "Kostfibre":{"value": 0,"goal": 38},
                "Tilsat sukker":{"value": 0,"goal": 37, "i": -1},
                "Vand":{"value": 0,"goal": 2000},
            },
            "aminoAcids": {
                "Alanin": {"value": 0,"goal": 2000},
                "Arginin": {"value": 0,"goal": 2000},
                "Asparaginsyre": {"value": 0,"goal": 2000},
                "Cystin": {"value": 0,"goal": 2000},
                "Glutaminsyre": {"value": 0,"goal": 2000},
                "Glycin": {"value": 0,"goal": 2000},
                "Histidin": {"value": 0,"goal": 2000},
                "Hydroxyprolin": {"value": 0,"goal": 2000},
                "Isoleucin": {"value": 0,"goal": 2000},
                "Leucin": {"value": 0,"goal": 2000},
                "Lysin": {"value": 0,"goal": 2000},
                "Methionin":{"value": 0,"goal": 2000},
                "Phenylalanin": {"value": 0,"goal": 2000},
                "Prolin": {"value": 0,"goal": 2000},
                "Serin": {"value": 0,"goal": 2000},
                "Threonin": {"value": 0,"goal": 2000},
                "Tryptofan": {"value": 0,"goal": 2000},
                "Tyrosin": {"value": 0,"goal": 2000},
                "Valin": {"value": 0,"goal": 2000},
            },
            "vitamins": {
                "A-vitamin":{"value": 0,"goal": 900},
                "B1-vitamin":{"value": 0,"goal": 1.4},
                "B12-vitamin":{"value": 0,"goal": 2},
                "B2-vitamin, riboflavin":{"value": 0,"goal": 1.7},
                "B6-vitamin":{"value": 0,"goal": 1.5},
                "Biotin":{"value": 0,"goal": 30},
                "C-vitamin":{"value": 0,"goal": 75},
                "D-vitamin":{"value": 0,"goal": 10},
                "D3-vitamin":{"value": 0,"goal": 10},
                "E-vitamin":{"value": 0,"goal": 10},
                "Folat":{"value": 0,"goal": 300},
                "K1-vitamin":{"value": 0,"goal": 70},
                "Niacin":{"value": 0,"goal": 20},
                "Niacinækvivalent":{"value": 0,"goal": 20},
            },
            "minerals": { 
                "Fosfor, P": {"value": 0,"goal": 600},
                "Kalium, K": {"value": 0,"goal": 3000},
                "Mangan, Mn": {"value": 0,"goal": 2.5},
                "Zink, Zn": {"value": 0,"goal": 9},
                "Selen, Se": {"value": 0,"goal": 60},
                "Calcium, Ca": {"value": 0,"goal": 900},
                "Magnesium, Mg": {"value": 0,"goal": 350},
                "Kobber, Cu": {"value": 0,"goal": 0.9},
                "Jern, Fe": {"value": 0,"goal": 11},
                "Chlorid, Cl": {"value": 0,"goal": 800, "i": -1},
                "Nikkel, Ni": {"value": 0,"goal": 700},
                "Tin, Sn": {"value": 0,"goal": 980, "i": -1},
                "Silicium, Si": {"value": 0,"goal": 30, "i": -1},
                "Cadmium, Cd": {"value": 0,"goal": 150, "i": -1},
                "Chrom, Cr": {"value": 0,"goal": 150, "i": -1},
                "Bor, B": {"value": 0,"goal": 5000, "i": -1},
                "Natrium, Na": {"value": 0,"goal": 1500, "i": -1},
                "Jod, I": {"value": 0,"goal": 150, "i": -1},
                "Kviksølv, Hg": {"value": 0,"goal": 7, "i": -1},
                "Molybdæn, Mo": {"value": 0,"goal": 150, "i": -1},
                "Bly, Pb": {"value": 0,"goal": 250, "i": -1},
                "Arsen uorganisk": {"value": 0,"goal": 20, "i": -1},
            },
            "fattyAcids": {
                "Sum monoumættede":{"value": 0,"goal": 4, "i": -1},
                "Sum mættede":{"value": 0,"goal": 4, "i": -1},
                "Sum n-3 fedtsyrer":{"value": 0,"goal": 3.6},
                "Sum n-6 fedtsyrer":{"value": 0,"goal": 3.6},
                "Sum polyumættede":{"value": 0,"goal": 4, "i": -1},
                "Transfedtsyrer, total":{"value": 0,"goal": 4, "i": -1},
            }
        }
    }

    removeFromTracker(index, foods){
        const data = foods[index].data;
        const amount = foods[index].amount;
        Object.keys(data).forEach(key =>{
            if (key === 'food' || key === 'id' || key === 'nameDk') { return; }
            if (data[key] === null) { return; }
            data[key].forEach(el =>{
                if (this.trackingInfo[key] !== undefined && this.trackingInfo[key][el.name] !== undefined){
                    this.trackingInfo[key][el.name].value -= (el.value * amount / 100);
                }
            })
        })
    }

    updateTracker(foods){
        for (const food of foods){
            var data = food.data;
            var amount = food.amount;
            Object.keys(data).forEach(key =>{
                if (key === 'food' || key === 'id' || key === 'nameDk') { return; }
                if (data[key] === null) { return; }
                data[key].forEach(el =>{
                    if (this.trackingInfo[key] !== undefined && this.trackingInfo[key][el.name] !== undefined){
                        this.trackingInfo[key][el.name].value += (el.value * amount / 100);
                    }
                })
            })
        }
    }

    getTrackingInfo(){
        return this.trackingInfo;
    }
}

export default Tracker;