findById(o, id) {
    // Early return
    if ( o.id === id ) {
      return o;
    }
    let result, p;
    for (p in o) {
        if ( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
            result = this.findById(o[p], id);
            if (result) {
                return result;
            }
        }
    }
    return result;
}
