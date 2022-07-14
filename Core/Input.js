import * as readline from 'node:readline';
class InputHandler {
    static rl = readline.createInterface(process.stdin, process.stdout);
    static demoSampler(prompt = 'Input>',type) {
        return new Promise(function (resolve, reject) {
            if (type === 1) {
                InputHandler.rl.question(prompt, (data) => {
                    resolve(data.split(','));
                });
            }
            if (type === 2) {
                InputHandler.rl.question(prompt, (data) => {
                    const inputMap = data.split(":");
                    resolve(inputMap);
                });
            }
        });
    }

    static initPlayerInput(playerTag){
        const res = InputHandler.demoSampler(`Player - ${playerTag} Input: `,1);
        return res;
    }

    static playerInput(playerTag){
        const res = InputHandler.demoSampler(`Player - ${playerTag}'s Move: `,2);
        return res;
    }
}
export default InputHandler;