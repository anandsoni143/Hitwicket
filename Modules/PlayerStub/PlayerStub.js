import Helper from "../../Core/Helper.js";
class Player {
    constructor(playerTag,moveDirection) {
        this.isPlayerSet = false;
        this.positionMap = {};
        this.playerTag = playerTag;
        // 1 is downward,2 is upward
        this.moveDirection = moveDirection;
        if (!playerTag) {
            throw new Error(`Tag is required`);
        }
    }
    setupPlayerData(data = [], secondary = false) {
        const length = data.length;
        for (let i = 0; i < length; ++i) {
            if (data[i] === 'h1' || data[i] === 'H1') {
                this.positionMap[`${data[i]}`] = { row: secondary ? 4 : 0, col: i, charType: 1 };
            }
            else if ((data[i] === 'h2' || data[i] === 'H2')) {
                this.positionMap[`${data[i]}`] = { row: secondary ? 4 : 0, col: i, charType: 2 };
            }
            else if ((data[i] === 'h3' || data[i] === 'H3')) {
                this.positionMap[`${data[i]}`] = { row: secondary ? 4 : 0, col: i, charType: 3 };
            }
            else {
                this.positionMap[`${data[i]}`] = { row: secondary ? 4 : 0, col: i };
            }
        }
    }

    getPreviousPosition(key){
        if(this.positionMap[key]){
        return this.positionMap[key];
        }
        else{
            return null;
        }
    }

    checkInternalCollision(row,col,currentBoard){
        const value = currentBoard[row][col];
        if(value.split('-')[0] === this.playerTag){
            console.log('Internal Collision Encontered');
            return true
        }
        return false;
    }

    handleCollisions(row,col,otherRef){
        const current = Helper.searchMapByValue(this.positionMap,{row,col});
        const other = Helper.searchMapByValue(otherRef.positionMap,{row,col});
        if(current && other){
            otherRef.removeFromMap(other);
        }
    }

    getModifierVector(pawn,changeVector){
        let effectorRow = 0;
        let effectorCol = 0;
        if(this.positionMap[pawn].charType && this.positionMap[pawn].charType === 1){
            if(changeVector[0] === 1){
                effectorRow+=1;
            }
            else if(changeVector[0] === -1){
                effectorRow-=1;
            }
            else if(changeVector[1] === 1){
                effectorCol+=1;
            }
            else if(changeVector[1] === -1){
                effectorCol-=1;
            }
        }
        if(this.positionMap[pawn].charType && this.positionMap[pawn].charType === 2){
            if(changeVector[0] === 1){
                effectorCol+1;
            }
            else if(changeVector[0] === -1){
                effectorCol+=1;
            }
            else if(changeVector[1] === 1){
                effectorRow+= this.moveDirection === 1 ? 1 : -1
            }
            else if(changeVector[1] === -1){
                effectorRow+=this.moveDirection === 1 ? 1 : -1;
            }
        }
        if(this.positionMap[pawn].charType && this.positionMap[pawn].charType === 3){
            if(changeVector[0] === 1){
                effectorRow+=1;
                effectorCol+1;
            }
            else if(changeVector[0] === -1){
                effectorRow-=1;
                effectorCol+=1;
            }
            else if(changeVector[1] === 1){
                effectorCol+=1;
                effectorRow+=1;
            }
            else if(changeVector[1] === -1){
                effectorCol-=1;
                effectorRow+=1;
            }
        }
        return [effectorRow,effectorCol];
    }
    
    updateWithVector(pawn,changeVector,currentBoard,otherRef){
        if(this.positionMap[pawn].row+changeVector[0]>5 || this.positionMap[pawn].row+changeVector[0]< 0 ){
            throw new Error('Invalid Input');
        }
        if(this.positionMap[pawn].col+changeVector[1]>5 || this.positionMap[pawn].col+changeVector[1]< 0 ){
            throw new Error('Invalid Input');
        }
        const internalCollCheck = this.checkInternalCollision(this.positionMap[pawn].row+changeVector[0],this.positionMap[pawn].col+changeVector[1],currentBoard);
        //In case of an internal collision skip the input entered by the user.
        if(internalCollCheck) {
            return;
        }
        const [effectorRow,effectorCol] = this.getModifierVector(pawn,changeVector);
        this.positionMap[pawn].row+= changeVector[0] + effectorRow;
        this.positionMap[pawn].col+= changeVector[1] + effectorCol;
        this.handleCollisions(this.positionMap[pawn].row,this.positionMap[pawn].col,otherRef);
    }
    updatePosition(position,currentBoard,otherRef){
        const pawn = position[0];
        let direction = position[1];
        direction = direction.toLowerCase();
        if(!this.positionMap[pawn]){
            return;
        }
        switch(direction){
            case 'l':
                this.updateWithVector(pawn,[0,-1],currentBoard,otherRef);
                break;
            case 'r':
                this.updateWithVector(pawn,[0,1],currentBoard,otherRef);
                break;
            case 'u':
                this.updateWithVector(pawn,[this.moveDirection === 1 ? 1 : -1,0],currentBoard,otherRef);
                break;
            case 'd':
                this.updateWithVector(pawn,[this.moveDirection === 1 ? 1 : -1,0],currentBoard,otherRef);
                break;
        }

    }

    removeFromMap(key){
        if(this.positionMap[key]){
            delete this.positionMap[key];
        }
    }
}
export default Player;