const isInt=(value)=> {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}
export {isInt}