export function generateRandomString(count: number){
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
    var resStr = "";
    for(var i=0; i<count; i++ ){
        resStr+=characters.charAt(Math.floor(Math.random()*characters.length))
    }
}