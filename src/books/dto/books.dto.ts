import { Expose, Transform, Type } from "class-transformer";

export class BooksDto{

    @Expose()
    totalBooks:number;

    @Expose()
    limit:number;

    @Expose()
    @Type(()=>BookList)
    books:BookList[];
}

export class BookList{
    @Expose({name:'book_id'})
    id:number;

    @Expose({name:'book_book_title'})
    title:string;
    @Expose({name:'book_book_description'})
    description:string;
    @Expose({name:'book_book_price'})
    price:number;

    @Expose({name:'book_book_author'})
    author:string;
    @Expose({name:'book_book_stock'})
    stock:number;
    @Expose({name:'book_book_images'})
    @Transform(({value})=>value.toString().split(','))
    images:string[];
    @Transform(({obj})=>{
        return{
            id:obj.genre_id,
            genre:obj.genre_genres
        } 
    })
    @Expose()
    genre:any;

    @Expose({name:'reviewCount'})
    review:number;

    @Expose({name:'avgRating'})
    rating:number;



 }