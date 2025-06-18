#!/usr/bin/env python3
import os
import re
from pathlib import Path
import argparse

class PathAliasReplacer:
    def __init__(self, src_root="src", alias="@/", extensions=None):
        self.src_root = Path(src_root).resolve()
        self.alias = alias
        self.extensions = extensions or ['.js', '.jsx', '.ts', '.tsx']
        
        # Regex patterns for different import styles
        self.import_patterns = [
            # import Component from '@/path'
            re.compile(r'import\s+([^{}\s]+)\s+from\s+["\']@/([^"\']+)["\']'),
            # import { Component } from '@/path'
            re.compile(r'import\s+\{([^}]+)\}\s+from\s+["\']@/([^"\']+)["\']'),
            # import * as Component from '@/path'
            re.compile(r'import\s+\*\s+as\s+([^{}\s]+)\s+from\s+["\']@/([^"\']+)["\']'),
            # const Component = require('@/path')
            re.compile(r'require\s*\(\s*["\']@/([^"\']+)["\']\s*\)'),
        ]
    
    def find_target_file(self, alias_path):
        """Find the actual file that corresponds to the alias path"""
        # Try direct file with extensions
        for ext in self.extensions:
            target_path = self.src_root / (alias_path + ext)
            if target_path.exists():
                return target_path
        
        # Try as directory with index file
        for ext in self.extensions:
            target_path = self.src_root / alias_path / ('index' + ext)
            if target_path.exists():
                return target_path
        
        # Try without extension (might be a directory)
        target_path = self.src_root / alias_path
        if target_path.is_dir():
            return target_path
        
        return None
    
    def compute_relative_path(self, from_file, to_file):
        """Compute relative path from one file to another"""
        try:
            rel_path = os.path.relpath(to_file, start=from_file.parent)
            
            # Remove file extension for imports
            rel_path = re.sub(r'\.(js|jsx|ts|tsx)$', '', rel_path)
            
            # Ensure relative paths start with ./ or ../
            if not rel_path.startswith('.'):
                rel_path = './' + rel_path
            
            # Use forward slashes for imports
            return rel_path.replace(os.sep, '/')
        except ValueError:
            return None
    
    def process_file(self, file_path):
        """Process a single file and replace alias imports"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            print(f"Warning: Could not read {file_path} (encoding issue)")
            return False
        
        original_content = content
        changes_made = 0
        
        # Process each import pattern
        for pattern in self.import_patterns:
            matches = list(pattern.finditer(content))
            
            for match in reversed(matches):  # Process in reverse to maintain positions
                if 'require' in match.group(0):
                    # Handle require statements
                    alias_path = match.group(1)
                    full_match = match.group(0)
                else:
                    # Handle import statements
                    alias_path = match.group(2)
                    full_match = match.group(0)
                
                # Find the target file
                target_file = self.find_target_file(alias_path)
                
                if target_file:
                    # Compute relative path
                    rel_path = self.compute_relative_path(file_path, target_file)
                    
                    if rel_path:
                        # Replace the alias with relative path
                        new_import = full_match.replace(f'@/{alias_path}', rel_path)
                        content = content[:match.start()] + new_import + content[match.end():]
                        changes_made += 1
                else:
                    print(f"Warning: Could not find target for '@/{alias_path}' in {file_path}")
        
        # Write back if changes were made
        if content != original_content:
            try:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return changes_made
            except Exception as e:
                print(f"Error writing to {file_path}: {e}")
                return False
        
        return 0
    
    def collect_files(self):
        """Collect all files to process"""
        files = []
        
        if not self.src_root.exists():
            print(f"Error: Source directory '{self.src_root}' does not exist")
            return files
        
        for root, dirs, filenames in os.walk(self.src_root):
            for filename in filenames:
                if any(filename.endswith(ext) for ext in self.extensions):
                    files.append(Path(root) / filename)
        
        return files
    
    def run(self, dry_run=False):
        """Run the path replacement process"""
        files = self.collect_files()
        
        if not files:
            print("No files found to process")
            return
        
        print(f"Found {len(files)} files to process")
        
        total_changes = 0
        processed_files = 0
        
        for file_path in files:
            if dry_run:
                print(f"Would process: {file_path}")
            else:
                changes = self.process_file(file_path)
                if changes:
                    print(f"Processed {file_path}: {changes} imports updated")
                    total_changes += changes
                    processed_files += 1
        
        if not dry_run:
            print(f"\nCompleted! Updated {total_changes} imports in {processed_files} files")
        else:
            print(f"\nDry run completed. Would process {len(files)} files")

def main():
    parser = argparse.ArgumentParser(description='Replace @/ path aliases with relative imports')
    parser.add_argument('--src', default='src', help='Source directory (default: src)')
    parser.add_argument('--alias', default='@/', help='Alias to replace (default: @/)')
    parser.add_argument('--dry-run', action='store_true', help='Show what would be changed without making changes')
    parser.add_argument('--extensions', nargs='+', default=['.js', '.jsx', '.ts', '.tsx'], 
                       help='File extensions to process')
    
    args = parser.parse_args()
    
    replacer = PathAliasReplacer(
        src_root=args.src,
        alias=args.alias,
        extensions=args.extensions
    )
    
    replacer.run(dry_run=args.dry_run)

if __name__ == '__main__':
    main()

