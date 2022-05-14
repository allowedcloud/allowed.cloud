const { DateTime } = require('luxon')
const typeset = require('typeset')

module.exports = {
    dateToFormat: function (date, format) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        )
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true
        })
    },

    obfuscate: function (str) {
        const chars = []
        for (var i = str.length - 1; i >= 0; i--) {
            chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
        }
        return chars.join('')
    },

    head: function (array, n) {
        if(!Array.isArray(array) || array.length === 0) {
            return [];
        }
        if( n < 0 ) {
            return array.slice(n);
        }
        return array.slice(0, n);
    },

    min: function (...numbers) {
        return Math.min.apply(null, numbers)
    },

    readableDate: function (dateObj) {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("MM.dd.yyyy");
    },

    htmlDateString: function (dateObj) {
        return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
    },

    typeSet: function (content) {
        const options = {
            disable: ['hyphenate', 'ligatures']
        }
        return typeset(content, options)
    }
}
