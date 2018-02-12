const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let total = blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
    return total
}

const favoriteBlog = (blogs) => {
    let favorite = blogs.reduce((prev, curr) => {
        return curr.likes > prev.likes ? curr : prev
    }, { likes: 0 })
    return favorite
}

const mostBlogs = (blogs) => {
    let authors = {}
    blogs.map((blog) => {
        authors.hasOwnProperty(blog.author) ? authors[blog.author] = authors[blog.author] + 1 : authors[blog.author] = 1
    })
    let most = 0
    let winner = ''
    for (let author in authors) {
        if (authors.hasOwnProperty(author)) {
            if (authors[author] > most ) {
                most = authors[author]
                winner = author
            }
        }
    }
    return { author: winner, blogs: most }
}

const mostLikes = (blogs) => {
    let authors = {}
    blogs.map((blog) => {
        authors.hasOwnProperty(blog.author) ? authors[blog.author] = authors[blog.author] + blog.likes : authors[blog.author] = blog.likes
    })
    let most = 0
    let winner = ''
    for (let author in authors) {
        if (authors.hasOwnProperty(author)) {
            if (authors[author] > most ) {
                most = authors[author]
                winner = author
            }
        }
    }
    return { author: winner, likes: most }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}