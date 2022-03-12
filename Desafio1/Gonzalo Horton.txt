class Usuario{
    constructor(firstname,lastname,books,pets){
        this.firstname = firstname;
        this.lastname = lastname;
        this.books = books;
        this.pets = pets;
    }

    getFullName(){
        return `${this.firstname} ${this.lastname}`;
    }

    addPet(pet){
        this.pets.push(pet)
    }

    countMascotas(){
        return this.pets.length
    }

    addBook(nombre, autor){
        this.books.push({
            libro : nombre,
            autor : autor
        })
    }

    getBookName(){
        let namesBooks = [];   
        this.books.forEach(book => namesBooks.push(book.libro))
        return namesBooks
    }

  

}

let usuario = new Usuario('Gonzalo', 'Horton',[{libro : 'Viaje al Centro de la Tierra',autor : 'Julio Verne'},{libro : 'Inferno',autor : 'Dan Brown'}], ['Norteña','París']);



console.log(usuario.getFullName());
console.log(usuario.addPet('Pupis'));
console.log(usuario.countMascotas());
console.log(usuario.addBook('Un libro', 'Un Autor'));
console.log(usuario.getBookName());