import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from 'src/app/core/services/movie.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {
  public movie: any;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: any) => {
      console.log(`params: ${paramMap.params.id}`);
      this.movieService.byId(paramMap.params.id).subscribe((movie: any) => {
        console.log(`And the winner is : ${JSON.stringify(movie)}`)
        this.movie = movie;
      })
    });
  }

}
