import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build
import glob

with open('drive-api.json', 'r') as json_file:
    service_account_info = json.load(json_file)
credentials = service_account.Credentials.from_service_account_info(
    service_account_info, scopes=['https://www.googleapis.com/auth/drive.readonly']
)

drive_service = build('drive', 'v3', credentials=credentials)

def list_mp3_files(folder_id):
    all_files = []
    page_token = None
    while True:
        results = drive_service.files().list(
            q=f"'{folder_id}' in parents and mimeType='audio/mpeg'",
            fields="nextPageToken, files(id, name)",
            pageToken=page_token,
            pageSize=1000
        ).execute()
        all_files.extend(results.get('files', []))
        page_token = results.get('nextPageToken')
        if not page_token:
            break
    return {file['name']: file['id'] for file in all_files}

folder_id = '1Gld2VPy5MoeI4JUG_aKxkPoTWactZVQu'
mp3_files = list_mp3_files(folder_id)

def update_markdown_files(mp3_files):
    replaced_count = 0
    failed_count = 0
    for md_file in glob.glob('content/sermons/*.md'):
        with open(md_file, 'r') as file:
            content = file.read()
        
        audio_lines = [line for line in content.split('\n') if line.startswith('audio:')]
        if not audio_lines:
            print(f"No audio line found in {md_file}")
            failed_count += 1
            continue
        
        audio_line = '\n'.join(audio_lines)
        wasabi_url = audio_line.split(': ', 1)[1].strip()
        if 'drive.google.com' in wasabi_url:
            continue
        
        audio_filename = wasabi_url.split('/')[-1]
        if not audio_filename.lower().endswith('.mp3'):
            remaining_lines = content.split('\n')[content.split('\n').index(audio_lines[0])+1:]
            for line in remaining_lines:
                audio_filename += ' ' + line.strip()
                if audio_filename.lower().endswith('.mp3'):
                    break
        
        from urllib.parse import unquote
        audio_filename = unquote(audio_filename)
        
        audio_filename = audio_filename.strip().strip('"\'')
        
        if not audio_filename.lower().endswith('.mp3'):
            audio_filename += '.mp3'
        
        if audio_filename[:2] == '24':
            audio_filename = '2024' + audio_filename[2:]
        
        drive_file_id = mp3_files.get(audio_filename)
        
        if drive_file_id:
            new_audio_line = f"audio: https://drive.google.com/file/d/{drive_file_id}/view"
            new_content = content.replace(audio_line, new_audio_line)
            
            with open(md_file, 'w') as file:
                file.write(new_content)
            print(f"Updated {md_file}")
            replaced_count += 1
        else:
            print(f"Error: {md_file}")
            failed_count += 1

    print(f"Summary: {replaced_count} files replaced, {failed_count} files failed")

def remove_extra_audio_lines():
    for md_file in glob.glob('content/sermons/*.md'):
        with open(md_file, 'r') as file:
            lines = file.readlines()
        
        new_lines = []
        audio_found = False
        for line in lines:
            if line.startswith('audio:'):
                audio_found = True
                new_lines.append(line)
            elif audio_found and line.startswith('  '):
                continue
            else:
                audio_found = False
                new_lines.append(line)
        
        with open(md_file, 'w') as file:
            file.writelines(new_lines)
        
        print(f"Processed {md_file}")


# print(mp3_files)
update_markdown_files(mp3_files)
remove_extra_audio_lines()