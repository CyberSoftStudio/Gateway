class Logger {
    constructor() {
        this.dataObjectDeepLevel = process.env.LOG_OBJECT_DATA_LEVEL || 150;
        this._logsToConsole = process.env.VS_RC_SYNC_LOGS_TO_CONSOLE
            && process.env.VS_RC_SYNC_LOGS_TO_CONSOLE.toLowerCase() === 'true';
    };
    get logsToConsole() {
        return this._logsToConsole;
    }
    set logsToConsole(sign) {
        this._logsToConsole = sign;
    }
    _tryToJson(data){
        let counter = 0;
        const levelLimit = this.dataObjectDeepLevel;
        const objectParser = (dataToParse) => {
            counter++;
            return (() => {
                if (counter > levelLimit) {
                    return { ...dataToParse, ...{ error: `Data object deeper data level limit(${levelLimit})`} };
                } else {
                    try {
                        if (dataToParse && typeof dataToParse === 'object' && dataToParse.length) {
                            return dataToParse.map((item) => objectParser(item));
                        }
                        if (dataToParse && typeof dataToParse === 'object' && dataToParse !== null) {
                            const parsedObject = {};
                            const keys = Object.keys(dataToParse);
                            keys.forEach((key)=>{
                                parsedObject[key] = objectParser(dataToParse[key]);
                            });
                            return parsedObject;
                        }                    
                        if (typeof dataToParse === 'string') {
                            try {
                                return JSON.parse(dataToParse);
                            } catch (error) {
                                return dataToParse;
                            }
                        }
                        return {};
                    }
                    catch (error) {
                        console.log({ error: error.message });
                        return {};
                    }
                }
            })();
        };
        return objectParser(data);
    }
    getLog(message) {
        return this._tryToJson(message);
    }

    log(message = '') {
        if (this._logsToConsole) {
            console.dir(this.getLog({log: message}));
        }
    }

    error(err = '') {
        if (this._logsToConsole) {
            console.error(this.getLog({error: err}));
        }
    }
}

module.exports = new Logger();