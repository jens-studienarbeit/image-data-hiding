SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [dbo].[spUsers_GetAll]
  @skip INT,
  @take INT,
  @total INT OUTPUT
AS
BEGIN
  SET NOCOUNT ON;

  SELECT
    Id,
    Username,
    RegistrationDate,
    DeletionDate
  FROM dbo.Users
  ORDER BY Id
    OFFSET @skip ROWS
    FETCH NEXT @take ROWS ONLY
  FOR JSON PATH;

  SELECT @total = COUNT(*)
  FROM dbo.Users;
END
GO