SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[spRefreshTokens_GetByToken]
  @token NVARCHAR(MAX)
AS
BEGIN

  SELECT *
  FROM dbo.RefreshTokens
  WHERE Token = @token
  FOR JSON PATH, WITHOUT_ARRAY_WRAPPER;

END
GO
