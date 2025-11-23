const fs = require('fs');

const filePath = './src/admin/ProductForm.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// Replace the options section
const oldText = `                        >
                            <option value="cafes_en_grano">Café en Grano</option>
                            <option value="insumos">Insumos</option>

                            <option value="preparaciones">Preparaciones</option>
                            <option value="accesorio">Accesorio</option>
                            <option value="otro">Otro</option>
                        </select>`;

const newText = `                        >
                            <option value="cafes_en_grano">Café en Grano</option>
                            <option value="insumos">Insumos</option>
                            <option value="Frias">Frías</option>
                            <option value="cafetería">Cafetería</option>
                            <option value="preparaciones">Preparaciones</option>
                            <option value="accesorio">Accesorio</option>
                            <option value="otro">Otro</option>
                        </select>`;

content = content.replace(oldText, newText);
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ successfully added Frias and cafetería optionsions');
