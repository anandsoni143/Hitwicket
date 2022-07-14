class Helper {
    static searchMapByValue(collection,sValue){
        for (let [key, value] of Object.entries(collection)) {
            if (value.row === sValue.row && value.col === sValue.col)
              return key;
          }
    }
}
export default Helper;