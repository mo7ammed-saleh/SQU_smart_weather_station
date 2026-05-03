Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
projectRoot = fso.GetAbsolutePathName(fso.BuildPath(scriptDir, "..\.."))
batPath = fso.BuildPath(scriptDir, "start-dashboard.bat")

shell.CurrentDirectory = projectRoot
shell.Run """" & batPath & """", 0, False
