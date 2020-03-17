export interface MovieInterface {
    idMovie: number,
    title: string,
    year: number,
    originalTitle?: string,
    duration?: number,
    director?: string,
    synopsis?: string,
    classification?: string,
    rating?: number
}