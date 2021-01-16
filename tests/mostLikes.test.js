const mostLikes = require('../utils/list_helper').mostLikes

describe('mostLikes', () => {

    const emptyList = []

    const listWithOnlyOneBlog = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        }
    ]

    const readyMadeList = [
        { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
        { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
        { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html", likes: 12, __v: 0 },
        { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
        { _id: "5a422ba71b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
        { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
    ]


    test('of an empty list returns []', () => {
        const results = mostLikes(emptyList)
        // expect(results).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
        // expect(results).toBe(undefined)
        expect(results).toEqual([])


    })

    test('of a list with a single item returns the same author, formatted', () => {
        const results = mostLikes(listWithOnlyOneBlog)
        // expect(results).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
        expect(results).toEqual({ author: 'Michael Chan', likes: 7 })

    })

    test('of a larger list returns the correct author, formatted', () => {
        const results = mostLikes(readyMadeList)
        // expect(results).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })
        expect(results).toEqual({ author: "Edsger W. Dijkstra", likes: 17 })

    })
})