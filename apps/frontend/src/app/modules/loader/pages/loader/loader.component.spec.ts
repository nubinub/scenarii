import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { CSVOpenerComponent } from '../../components/csv-opener/csvopener.component';
import { FileHistoryComponent } from '../../components/file-history/file-history.component';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { StatusComponent } from '../../components/status/status.component';
import { ExtensionListPipe } from '../../pipes/extension-list/extension-list.pipe';

import { LoaderComponent } from './loader.component';

describe('LoaderComponent', () => {
  let component: LoaderComponent;
  let fixture: ComponentFixture<LoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoaderComponent,
        StatusComponent,
        FileHistoryComponent,
        CSVOpenerComponent,
        FileUploadComponent,
        ExtensionListPipe,
      ],
      imports: [ReactiveFormsModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});