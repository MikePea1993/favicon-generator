#!/bin/bash

# project-map.sh - Maps project directory structure and creates a text visualization
# Usage: bash project-map.sh [directory] [max_depth] [exclude_pattern]

# Default values
TARGET_DIR=${1:-.}
MAX_DEPTH=${2:-5}
# Comprehensive exclusion pattern similar to .gitignore
EXCLUDE_PATTERN=${3:-"node_modules|\.git|dist|build|\.cache|coverage|\.next|\.nuxt|\.vscode|\.idea|\.DS_Store|\.env|vendor|bower_components|logs|tmp|temp|__pycache__|\.pytest_cache|\.eslintcache|\.sass-cache|npm-debug\.log|yarn-debug\.log|yarn-error\.log|package-lock\.json|yarn\.lock"}
OUTPUT_FILE="project_structure.txt"

echo "Mapping project structure from $TARGET_DIR (max depth: $MAX_DEPTH)"
echo "Excluding: $EXCLUDE_PATTERN"
echo "Output will be saved to $OUTPUT_FILE"

# Project header
echo "# DevFlow Project Structure Map" > "$OUTPUT_FILE"
echo "Generated on: $(date)" >> "$OUTPUT_FILE"
echo "Max depth: $MAX_DEPTH" >> "$OUTPUT_FILE"
echo "Excluded patterns: $EXCLUDE_PATTERN" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

# Get the project root name
ROOT_NAME=$(basename "$(pwd)")
echo "## $ROOT_NAME" >> "$OUTPUT_FILE"

# Function to get file size in human-readable format
get_file_size() {
  local file="$1"
  local size=$(stat -c "%s" "$file" 2>/dev/null || stat -f "%z" "$file" 2>/dev/null)
  
  if [ "$size" -lt 1024 ]; then
    echo "${size}B"
  elif [ "$size" -lt 1048576 ]; then
    echo "$(($size/1024))KB"
  else
    echo "$(($size/1048576))MB"
  fi
}

# Function to generate indentation
get_indent() {
  local depth=$1
  local indent=""
  for ((i=1; i<depth; i++)); do
    indent="$indent  "
  done
  echo "$indent"
}

# Function to traverse directory and create tree
traverse_dir() {
  local dir=$1
  local depth=$2
  local base_path=$3
  
  # Skip if we've reached max depth
  if [ "$depth" -gt "$MAX_DEPTH" ]; then
    return
  fi
  
  # Get files and directories, sorted alphabetically with directories first
  local items=($(find "$dir" -maxdepth 1 -mindepth 1 -not -path "*/\.*" | grep -v -E "$EXCLUDE_PATTERN" | sort))
  
  # Process directories first, then files
  local dirs=()
  local files=()
  
  for item in "${items[@]}"; do
    if [ -d "$item" ]; then
      dirs+=("$item")
    else
      files+=("$item")
    fi
  done
  
  # Create indent based on depth
  local indent=$(get_indent $depth)
  
  # Process directories
  for d in "${dirs[@]}"; do
    local dir_name=$(basename "$d")
    echo "$indent- 📂 $dir_name/" >> "$OUTPUT_FILE"
    # Recursively process subdirectory
    traverse_dir "$d" $((depth+1)) "$base_path/$dir_name"
  done
  
  # Process files
  for f in "${files[@]}"; do
    local file_name=$(basename "$f")
    local file_ext="${file_name##*.}"
    local file_size=$(get_file_size "$f")
    
    # Choose emoji based on file extension
    local emoji="📄"
    case "$file_ext" in
      js|jsx|ts|tsx) emoji="📜" ;; # JavaScript/TypeScript
      html|htm) emoji="🌐" ;; # HTML
      css|scss|sass) emoji="🎨" ;; # CSS/Styles
      json) emoji="📋" ;; # JSON
      md) emoji="📝" ;; # Markdown
      txt) emoji="📃" ;; # Text
      png|jpg|jpeg|gif|svg|webp) emoji="🖼️" ;; # Images
      pdf) emoji="📕" ;; # PDF
      zip|tar|gz|rar) emoji="📦" ;; # Archives
      exe|dll) emoji="⚙️" ;; # Executables
      php) emoji="🐘" ;; # PHP
      py) emoji="🐍" ;; # Python
      rb) emoji="💎" ;; # Ruby
      java) emoji="☕" ;; # Java
      go) emoji="🦫" ;; # Go
      rs) emoji="🦀" ;; # Rust
      *) emoji="📄" ;; # Default
    esac
    
    echo "$indent  $emoji $file_name ($file_size)" >> "$OUTPUT_FILE"
  done
}

# Start traversing from the target directory
traverse_dir "$TARGET_DIR" 1 ""

# Add file type statistics
echo "" >> "$OUTPUT_FILE"
echo "## File Type Statistics" >> "$OUTPUT_FILE"

find "$TARGET_DIR" -type f -not -path "*/\.*" | grep -v -E "$EXCLUDE_PATTERN" | \
awk -F. '{
  ext = NF > 1 ? $NF : "no_extension";
  count[ext]++;
  total++;
}
END {
  print "Total Files: " total;
  print "";
  print "Breakdown by type:";
  print "";
  print "| Extension | Count | Percentage |";
  print "|-----------|-------|------------|";
  for (ext in count) {
    printf "| .%-10s | %5d | %9.1f%% |\n", ext, count[ext], (count[ext]*100/total);
  }
}' | sort -k3nr >> "$OUTPUT_FILE"

# Add directory statistics
echo "" >> "$OUTPUT_FILE"
echo "## Directory Statistics" >> "$OUTPUT_FILE"

find "$TARGET_DIR" -type d -not -path "*/\.*" | grep -v -E "$EXCLUDE_PATTERN" | \
awk '
BEGIN {
  count = 0;
}
{
  count++;
  depth = gsub("/", "/");
  depths[depth]++;
  max_depth = (depth > max_depth) ? depth : max_depth;
}
END {
  print "Total Directories: " count;
  print "";
  print "Breakdown by depth:";
  print "";
  print "| Depth | Count |";
  print "|-------|-------|";
  for (d=1; d<=max_depth; d++) {
    if (depths[d] > 0) {
      printf "| %5d | %5d |\n", d, depths[d];
    }
  }
}' >> "$OUTPUT_FILE"

echo "Project structure map created in $OUTPUT_FILE"
echo "You can view it with: cat $OUTPUT_FILE"