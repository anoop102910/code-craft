import { Test, TestingModule } from '@nestjs/testing';
import { SubmitCodeService } from './submit-code.service';

describe('SubmitCodeService', () => {
  let service: SubmitCodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmitCodeService],
    }).compile();

    service = module.get<SubmitCodeService>(SubmitCodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
