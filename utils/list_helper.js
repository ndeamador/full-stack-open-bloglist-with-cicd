/* eslint-disable */

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {

    const totalLikes = blogs.reduce((accumulator, blog) => {
        return accumulator + blog.likes
    }, 0)

    return totalLikes
}

const favoriteBlog = (blogs) => {

    if (blogs.length === 0) {
        return blogs
    }

    const highestLikes = blogs.reduce((larger, blog) => {
        return Math.max(larger, blog.likes)
    }, 0)

    const favoriteBlog = blogs.find(blog => blog.likes === highestLikes)

    // making a subset of object properties using ES6 destructuring
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    // Remove _id, url and __v
    const { _id, url, __v, ...formattedFavoriteBlog } = favoriteBlog

    return formattedFavoriteBlog
}

const mostBlogs = (blogs) => {

    const allAuthorOccurrences = blogs.map(blog => blog.author)
    let blogsCount = []
    let numberOfAuthors = 0


    allAuthorOccurrences.forEach((author, i) => {

        if (!blogsCount.find(blog => blog.author === author)) {

            blogsCount = blogsCount.concat(
                {
                    author: author,
                    blogs: 0
                }
            )
            numberOfAuthors++
        }

        const index = blogsCount.findIndex(blog => blog.author === author)

        blogsCount[index].blogs++
    })



    const highestNumberOfBlogs = Math.max(...blogsCount.map(author => author.blogs))
    const mostProlificAuthor = blogsCount.find(author => author.blogs === highestNumberOfBlogs)

    // console.log('blogs count:', blogsCount)
    // console.log('most prolific', mostProlificAuthor)

    return mostProlificAuthor || blogs

}

const mostLikes = (blogs) => {

    const formattedBlogs = blogs.map(({ author, likes }) => ({ author, likes }))
    // console.log('filtered', formattedBlogs) //comment

    const blogsWithAddedLikes = formattedBlogs.reduce((accumulator, blog) => {

        let foundAuthor = accumulator.find(element => element.author === blog.author)
        // console.log('foundAuthor = ', foundAuthor) //comment

        if(!foundAuthor) { return accumulator.concat({ author: blog.author, likes: blog.likes }) }

        foundAuthor.likes += blog.likes

        return accumulator

    }, [])

    // console.log('blogwithadded: ', blogsWithAddedLikes, blogsWithAddedLikes.length===0, typeof(blogsWithAddedLikes) ) //comment

    if (blogsWithAddedLikes.length === 0) {
        return blogsWithAddedLikes
    } else {
        const highestLikes = Math.max(...blogsWithAddedLikes.map(blog => blog.likes))
        // console.log('highestLikes:', highestLikes) //comment

        const mostLikedAuthor = blogsWithAddedLikes.find(blog => blog.likes === highestLikes)
        // console.log('mostLikedAuthor :', mostLikedAuthor) //comment

        return mostLikedAuthor
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}

