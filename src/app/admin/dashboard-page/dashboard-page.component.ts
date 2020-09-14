import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PostsService} from '../../shared/posts.service';
import {Post} from '../../shared/interfaces';
import {Subscription} from 'rxjs';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {AlertService} from '../shared/services/alert.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  postSubscribe: Subscription;
  deleteSubscribe: Subscription;
  displayedColumns: string[] = ['id','author', 'title', 'date', 'actions'];
  dataSource: any;

  @ViewChild(MatSort, {static: false}) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private postsService: PostsService,
              private alert: AlertService) { }

  ngOnInit() {
    this.postSubscribe = this.postsService.getAll().subscribe(posts => {
      this.posts = posts;

      if (posts) {
        this.dataSource = new MatTableDataSource<Post>(posts);
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  remove(id: string) {
    this.postsService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.dataSource = new MatTableDataSource<Post>(this.posts);
      this.dataSource.paginator = this.paginator;
      this.alert.danger('The post was deleted')
    })
  }

  applyFilter($event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnDestroy() {
    if (this.postSubscribe) {
      this.postSubscribe.unsubscribe();
    }

    if (this.deleteSubscribe) {
      this.deleteSubscribe.unsubscribe();
    }
  }
}
