SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [dbo].[spUsers_Delete]
  @id INT
AS
BEGIN

  DELETE FROM dbo.Users
  WHERE Id = @id;

END
GO
