import { TestBed } from '@angular/core/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return API base URL', () => {
    expect(service.apiBaseUrl).toBeDefined();
    expect(typeof service.apiBaseUrl).toBe('string');
  });

  it('should return host', () => {
    expect(service.host).toBeDefined();
    expect(typeof service.host).toBe('string');
  });

  it('should return port', () => {
    expect(service.port).toBeDefined();
    expect(typeof service.port).toBe('number');
  });

  it('should construct full API URL', () => {
    const path = '/test/endpoint';
    const fullUrl = service.getApiUrl(path);
    expect(fullUrl).toContain(service.apiBaseUrl);
    expect(fullUrl).toContain(path);
  });
});
