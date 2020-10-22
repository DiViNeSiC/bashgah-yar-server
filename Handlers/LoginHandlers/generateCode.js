module.exports = (loginTokenExpireTime) => {
    const digits = [
        '1', '2', '3', '4', '5', '6', '7', '8', '9', 
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 
        'j', , 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 
        's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
    ]

    let code = ''

    for(let i = 0; i < 6; i++) {
        const randomDigit = Math.floor(Math.random() * 34)
        code += digits[randomDigit]
    }

    return `${code}${loginTokenExpireTime}`
}