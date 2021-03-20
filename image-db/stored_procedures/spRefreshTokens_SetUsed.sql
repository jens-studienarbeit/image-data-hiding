SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[spRefreshTokens_SetUsed]
  @id INT
AS
BEGIN

  UPDATE dbo.RefreshTokens
  SET Used = 1
  WHERE Id = @id;

END
GO