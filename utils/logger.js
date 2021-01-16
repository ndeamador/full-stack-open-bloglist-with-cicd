const info = (...params) => {
    // don't run if in testing mode to prevent that this obstructs the test execution output.
    // if (process.env.NODE_ENV !== 'test') {
    //     console.log(...params)
    // }
    console.log(...params)

}

const error = (...params) => {
    console.log(...params);
}

module.exports = {
    info, error
}