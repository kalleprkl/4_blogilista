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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}