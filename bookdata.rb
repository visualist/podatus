
def find_or_create attrib
  #b = Book.create(attrib)
  b = Book.where(attrib).first_or_create
  b.save
end

puts "before: #{Book.count}"


book = {
  title: 'Pride and Prejudice',
  author: 'Jane Austen',
  published_year: 1813
}
find_or_create book


book = {
  title: 'Frankenstein',
  author: 'Mary Shelley',
  published_year: 1818
}
find_or_create book


book = {
  title: 'Alice in Wonderland',
  author: 'Lewis Carroll',
  published_year: 1865
}
find_or_create book


book = {
  title: 'Tale of Two Cities',
  author: 'Charles Dickens',
  published_year: 1859
}
find_or_create book


book = {
  title: 'Moby Dick',
  author: 'Herman Melville',
  published_year: 1851
}
find_or_create book



puts "after: #{Book.count}"

books = Book.all.order(:published_year)
books.each do |book|
  puts "#{book.title} by #{book.author}, #{book.published_year}"
end

