import {
  Controller,
  Get,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AssetService } from './asset.service';

@UseGuards(AuthGuard('api-key'))
@Controller('api/v1/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async index(
    @Query('asset_type') assetType: string,
    @Query('asset_id') assetId: number,
    @Res({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    return this.assetService.getAsset(assetType, assetId, res);
  }
}
